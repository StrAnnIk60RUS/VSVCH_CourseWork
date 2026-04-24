import { Course, Enrollment, Exercise, Lesson, Submission, User } from '../db/models/index.js';
import { getLastSubmissionByUserIds } from './activityService.js';

export async function getStudentProgressReport(userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    return null;
  }
  const enrollments = await Enrollment.findAll({
    where: { userId },
    include: [{ model: Course, as: 'course' }],
    order: [['created_at', 'DESC']],
  });
  const scores = await Submission.findAll({
    where: { userId },
    attributes: ['score'],
    include: [
      {
        model: Exercise,
        as: 'exercise',
        attributes: ['lessonId'],
        include: [{ model: Lesson, as: 'lesson', attributes: ['courseId'] }],
      },
    ],
  });
  /** @type {Record<string, number>} */
  const scoreMap = {};
  for (const row of scores) {
    const courseId = row.exercise?.lesson?.courseId;
    if (!courseId) {
      continue;
    }
    scoreMap[courseId] = (scoreMap[courseId] || 0) + (Number(row.score) || 0);
  }
  return {
    user: user.get({ plain: true }),
    items: enrollments.map((x) => ({
      courseId: x.courseId,
      courseTitle: x.course?.title ?? 'Unknown',
      progress: x.progress,
      score: scoreMap[x.courseId] ?? 0,
    })),
  };
}

export async function getCourseSummaryReport(courseId) {
  const course = await Course.findByPk(courseId);
  if (!course) {
    return null;
  }
  const enrollments = await Enrollment.findAll({
    where: { courseId },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
  });
  const userIds = enrollments.map((x) => x.userId);
  const lastByUser = await getLastSubmissionByUserIds(userIds);
  const students = enrollments.map((enr) => ({
    userId: enr.userId,
    name: enr.user.name,
    email: enr.user.email,
    progress: enr.progress,
    lastActivity: new Date(lastByUser[enr.userId] || enr.createdAt).toISOString().slice(0, 10),
  }));
  const avgProgress =
    students.length > 0
      ? Math.round(students.reduce((acc, x) => acc + Number(x.progress || 0), 0) / students.length)
      : 0;
  return {
    course: course.get({ plain: true }),
    students,
    studentCount: students.length,
    avgProgress,
  };
}
