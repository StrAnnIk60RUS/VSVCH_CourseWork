import { User, UserRole } from '../db/models/index.js';

/**
 * @param {string} userId
 * @returns {Promise<{ id: string, email: string, name: string, roles: string[] } | null>}
 */
export async function getAuthUserDtoById(userId) {
  const user = await User.findByPk(userId, {
    include: [{ model: UserRole, as: 'userRoles', attributes: ['roleCode'] }],
  });
  if (!user) {
    return null;
  }
  const roles = (user.userRoles || [])
    .map((/** @type {{ roleCode: string }} */ ur) => ur.roleCode)
    .sort();
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    roles,
  };
}
