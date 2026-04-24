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

  /** @type {Record<string, string>} */
  const result = {};
  for (const row of rows) {
    if (row.lastActivity) {
      result[row.userId] = row.lastActivity;
    }
  }
  return result;
}
