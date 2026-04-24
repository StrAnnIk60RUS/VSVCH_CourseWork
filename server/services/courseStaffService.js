import { CourseStaff, User } from '../db/models/index.js';

/**
 * Returns first TEACHER staff member for each course.
 * @param {string[]} courseIds
 */
export async function getLeadTeachersByCourseIds(courseIds) {
  if (!courseIds.length) {
    return {};
  }

  const rows = await CourseStaff.findAll({
    where: { courseId: courseIds, staffRole: 'TEACHER' },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
    order: [
      ['courseId', 'ASC'],
      ['createdAt', 'ASC'],
    ],
  });

  /** @type {Record<string, import('../db/models/index.js').User | null>} */
  const leadByCourseId = {};
  for (const row of rows) {
    if (!leadByCourseId[row.courseId]) {
      leadByCourseId[row.courseId] = row.user ?? null;
    }
  }
  return leadByCourseId;
}
