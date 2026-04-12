import { getAuthUserDtoById } from '../utils/authUser.js';
import { verifyAccessToken } from '../utils/jwt.js';

/**
 * @typedef {{ id: string, email: string, name: string, roles: string[] }} AuthUserDto
 */

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  const token = header.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  let userId;
  try {
    ({ sub: userId } = verifyAccessToken(token));
  } catch {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
  const user = await getAuthUserDtoById(userId);
  if (!user) {
    return res.status(401).json({ error: 'Пользователь не найден' });
  }
  req.authUser = user;
  next();
}
