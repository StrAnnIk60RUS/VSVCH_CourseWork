import { Op } from 'sequelize';
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

/**
 * @param {string} courseId
 * @param {number} periodDays
 */
export async function getCourseAnalyticsReport(courseId, periodDays = 30) {
  const summary = await getCourseSummaryReport(courseId);
  if (!summary) {
    return null;
  }

  const now = new Date();
  const safePeriodDays = Number.isFinite(periodDays)
    ? Math.min(Math.max(Math.trunc(periodDays), 7), 90)
    : 30;
  const fromDate = new Date(now);
  fromDate.setDate(fromDate.getDate() - (safePeriodDays - 1));
  const fromTime = fromDate.getTime();

  const students = summary.students.map((student) => {
    const lastActivityAt = new Date(student.lastActivity);
    const inactiveDays = Number.isFinite(lastActivityAt.getTime())
      ? Math.max(0, Math.floor((now.getTime() - lastActivityAt.getTime()) / (1000 * 60 * 60 * 24)))
      : 999;
    return {
      ...student,
      inactiveDays,
      progress: Number(student.progress) || 0,
    };
  });

  const riskStudents = students.filter((student) => student.progress < 40 || student.inactiveDays >= 14).length;
  const activeStudents = students.filter((student) => student.inactiveDays <= 7).length;

  const buckets = {
    p0_25: 0,
    p26_50: 0,
    p51_75: 0,
    p76_100: 0,
  };
  for (const student of students) {
    if (student.progress <= 25) buckets.p0_25 += 1;
    else if (student.progress <= 50) buckets.p26_50 += 1;
    else if (student.progress <= 75) buckets.p51_75 += 1;
    else buckets.p76_100 += 1;
  }

  const submissions = await Submission.findAll({
    attributes: ['userId', 'createdAt'],
    include: [
      {
        model: Exercise,
        as: 'exercise',
        attributes: ['id'],
        required: true,
        include: [
          {
            model: Lesson,
            as: 'lesson',
            attributes: ['id', 'courseId'],
            required: true,
            where: { courseId },
          },
        ],
      },
    ],
    where: {
      createdAt: {
        [Op.gte]: fromDate,
      },
    },
    order: [['created_at', 'ASC']],
  });

  /** @type {Record<string, { date: string; submissions: number; activeStudents: Set<string> }>} */
  const dayMap = {};
  for (let i = 0; i < safePeriodDays; i += 1) {
    const date = new Date(fromDate);
    date.setDate(fromDate.getDate() + i);
    const dateKey = date.toISOString().slice(0, 10);
    dayMap[dateKey] = { date: dateKey, submissions: 0, activeStudents: new Set() };
  }

  for (const row of submissions) {
    const createdAt = new Date(row.createdAt);
    if (createdAt.getTime() < fromTime) {
      continue;
    }
    const dateKey = createdAt.toISOString().slice(0, 10);
    if (!dayMap[dateKey]) {
      continue;
    }
    dayMap[dateKey].submissions += 1;
    dayMap[dateKey].activeStudents.add(row.userId);
  }

  const timeline = Object.values(dayMap).map((day) => ({
    date: day.date,
    submissions: day.submissions,
    activeStudents: day.activeStudents.size,
  }));

  return {
    course: summary.course,
    periodDays: safePeriodDays,
    kpis: {
      students: summary.studentCount,
      avgProgress: summary.avgProgress,
      activeStudents7d: activeStudents,
      riskStudents,
    },
    progressBuckets: buckets,
    students,
    timeline,
  };
}
