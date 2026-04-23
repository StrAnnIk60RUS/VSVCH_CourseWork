import { Router } from 'express';
import { z } from 'zod';
import { Course, CourseStaff, Enrollment, Lesson, LessonCompletion, User } from '../db/models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { hasRole } from '../utils/permissions.js';
import { recalculateProgress } from '../utils/progress.js';

const router = Router();

const createSchema = z.object({
  courseId: z.string(),
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'STUDENT')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Некорректные данные' });
    }
    const { courseId } = parsed.data;
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    try {
      const enrollment = await Enrollment.create({
        userId: req.authUser.id,
        courseId,
        progress: 0,
      });
      return res.status(201).json(enrollment.get({ plain: true }));
    } catch (err) {
      if (err && typeof err === 'object' && 'name' in err && err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Вы уже записаны на курс' });
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const rows = await Enrollment.findAll({
      where: { userId: req.authUser.id },
      include: [{ model: Course, as: 'course' }],
      order: [['createdAt', 'DESC']],
    });
    const items = await Promise.all(
      rows.map(async (row) => {
        const plain = row.get({ plain: true });
        const lead = await CourseStaff.findOne({
          where: { courseId: row.courseId, staffRole: 'TEACHER' },
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
          order: [['createdAt', 'ASC']],
        });
        const teacher = lead?.user?.get({ plain: true }) ?? null;
        return {
          id: plain.id,
          courseId: plain.courseId,
          progress: plain.progress,
          enrolledAt: plain.createdAt,
          course: plain.course,
          leadTeacher: teacher,
        };
      }),
    );
    return res.status(200).json({ items });
  } catch (err) {
    next(err);
  }
});

router.delete('/:courseId', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'STUDENT')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId } = req.params;
    const deleted = await Enrollment.destroy({ where: { userId: req.authUser.id, courseId } });
    if (!deleted) {
      return res.status(404).json({ error: 'Запись на курс не найдена' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.post('/complete-lesson/:courseId/:lessonId', requireAuth, async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const enrollment = await Enrollment.findOne({ where: { userId: req.authUser.id, courseId } });
    if (!enrollment) {
      return res.status(403).json({ error: 'Сначала запишитесь на курс' });
    }
    const lesson = await Lesson.findOne({ where: { id: lessonId, courseId } });
    if (!lesson) {
      return res.status(404).json({ error: 'Урок не найден' });
    }
    await LessonCompletion.findOrCreate({
      where: { userId: req.authUser.id, lessonId },
      defaults: { userId: req.authUser.id, lessonId },
    });
    const progress = await recalculateProgress(req.authUser.id, courseId);
    return res.status(200).json({ ok: true, progress });
  } catch (err) {
    next(err);
  }
});

export default router;
