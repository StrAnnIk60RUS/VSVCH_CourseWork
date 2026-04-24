import { Router } from 'express';
import {
  Course,
  CourseStaff,
  Enrollment,
  Lesson,
  User,
} from '../db/models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { canManageCourse, hasRole } from '../utils/permissions.js';
import { getLastSubmissionByUserIds } from '../services/activityService.js';

const router = Router();

function toStudentRow(enrollment, lastActivity) {
  const now = Date.now();
  const lastTs = lastActivity ? new Date(lastActivity).getTime() : new Date(enrollment.createdAt).getTime();
  const active = now - lastTs <= 14 * 24 * 60 * 60 * 1000;
  return {
    userId: enrollment.user.id,
    name: enrollment.user.name,
    email: enrollment.user.email,
    progress: enrollment.progress,
    enrolledAt: enrollment.createdAt,
    lastActivity: new Date(lastTs).toISOString(),
    active,
  };
}

router.get('/courses', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'TEACHER')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const staffRows = await CourseStaff.findAll({
      where: { userId: req.authUser.id, staffRole: 'TEACHER' },
      include: [{ model: Course, as: 'course' }],
      order: [[{ model: Course, as: 'course' }, 'created_at', 'DESC']],
    });
    const courseIds = staffRows.map((row) => row.course.id);
    const [lessonCounts, enrollmentCounts] = await Promise.all([
      Lesson.count({ where: { courseId: courseIds }, group: ['course_id'] }),
      Enrollment.count({ where: { courseId: courseIds }, group: ['course_id'] }),
    ]);
    const lessonCountMap = Object.fromEntries(lessonCounts.map((item) => [item.courseId, Number(item.count)]));
    const enrollmentCountMap = Object.fromEntries(
      enrollmentCounts.map((item) => [item.courseId, Number(item.count)]),
    );
    const items = staffRows.map((row) => {
      const course = row.course;
      return {
        id: course.id,
        title: course.title,
        language: course.language,
        level: course.level,
        published: course.published,
        createdAt: course.createdAt,
        lessonCount: lessonCountMap[course.id] ?? 0,
        enrollmentCount: enrollmentCountMap[course.id] ?? 0,
      };
    });
    return res.status(200).json({ items });
  } catch (err) {
    next(err);
  }
});

router.get('/courses/:courseId/students', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'TEACHER')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId } = req.params;
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }

    const enrollments = await Enrollment.findAll({
      where: { courseId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
    });
    const userIds = enrollments.map((x) => x.userId);
    const lastByUser = await getLastSubmissionByUserIds(userIds);

    let items = enrollments.map((enr) => toStudentRow(enr, lastByUser[enr.userId]));
    const status = req.query.status;
    if (status === 'active') {
      items = items.filter((x) => x.active);
    } else if (status === 'inactive') {
      items = items.filter((x) => !x.active);
    }

    const sort = typeof req.query.sort === 'string' ? req.query.sort : 'name';
    const order = typeof req.query.order === 'string' && req.query.order.toLowerCase() === 'asc' ? 1 : -1;
    items.sort((a, b) => {
      if (sort === 'progress') {
        return (a.progress - b.progress) * order;
      }
      if (sort === 'activity') {
        return (new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime()) * order;
      }
      return a.name.localeCompare(b.name, 'ru') * order;
    });

    return res.status(200).json({ items });
  } catch (err) {
    next(err);
  }
});

router.get('/courses/:courseId/students.csv', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'TEACHER')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId } = req.params;
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const enrollments = await Enrollment.findAll({
      where: { courseId },
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      order: [['created_at', 'DESC']],
    });
    const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`;
    const lines = ['name,email,progress,enrolledAt'];
    for (const row of enrollments) {
      lines.push(
        [
          escapeCsv(row.user.name),
          escapeCsv(row.user.email),
          row.progress,
          escapeCsv(new Date(row.createdAt).toISOString()),
        ].join(','),
      );
    }
    const csv = `\uFEFF${lines.join('\n')}`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="course-${courseId}-students.csv"`);
    return res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
});

router.get('/courses/:courseId', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'TEACHER')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId } = req.params;
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    const lessons = await Lesson.findAll({
      where: { courseId },
      order: [['sortOrder', 'ASC']],
      attributes: ['id', 'title', 'content'],
    });
    const plain = course.get({ plain: true });
    return res.status(200).json({
      id: plain.id,
      title: plain.title,
      description: plain.description,
      language: plain.language,
      level: plain.level,
      published: plain.published,
      lessons: lessons.map((x) => {
        const row = x.get({ plain: true });
        return { id: row.id, title: row.title, content: row.content ?? '' };
      }),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
