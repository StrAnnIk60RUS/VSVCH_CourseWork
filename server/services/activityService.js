import { fn, col } from 'sequelize';
import { Submission } from '../db/models/index.js';

/**
 * @param {string[]} userIds
 */
export async function getLastSubmissionByUserIds(userIds) {
  if (!userIds.length) {
    return {};
  }

  const rows = await Submission.findAll({
    where: { userId: userIds },
    attributes: ['userId', [fn('MAX', col('created_at')), 'lastActivity']],
    group: ['userId'],
    raw: true,
  });

  /** @type {Record<string, Date | string>} */
  const result = {};
  for (const row of rows) {
    const userId = row.userId ?? row.user_id;
    const lastActivity = row.lastActivity ?? row.last_activity;
    if (userId && lastActivity) {
      result[userId] = lastActivity;
    }
  }
  return result;
}
