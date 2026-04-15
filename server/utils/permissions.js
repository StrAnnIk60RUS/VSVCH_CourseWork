import { CourseStaff } from '../db/models/index.js';
import { Op } from 'sequelize';

/**
 * @param {import('express').Request} req
 * @returns {boolean}
 */
export function hasRole(req, role) {
  return Array.isArray(req.authUser?.roles) && req.authUser.roles.includes(role);
}

/**
 * @param {string} courseId
 * @param {string} userId
 */
export async function canManageCourse(courseId, userId) {
  const staff = await CourseStaff.findOne({
    where: {
      courseId,
      userId,
      staffRole: { [Op.in]: ['TEACHER', 'AUTHOR', 'METHODIST'] },
    },
  });
  return Boolean(staff);
}
