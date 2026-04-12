import jwt from 'jsonwebtoken';
import { getJwtExpiresIn, getJwtSecret } from '../config/authConfig.js';

/**
 * @param {string} userId
 * @returns {string}
 */
export function signAccessToken(userId) {
  return jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: getJwtExpiresIn() });
}

/**
 * @param {string} token
 * @returns {{ sub: string }}
 */
export function verifyAccessToken(token) {
  const payload = jwt.verify(token, getJwtSecret());
  if (typeof payload === 'string' || !payload || typeof payload !== 'object') {
    throw new Error('Invalid payload');
  }
  const sub = /** @type {{ sub?: unknown }} */ (payload).sub;
  if (typeof sub !== 'string' || !sub) {
    throw new Error('Invalid sub');
  }
  return { sub };
}
