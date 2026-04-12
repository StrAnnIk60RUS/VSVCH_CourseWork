import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User, UserRole, sequelize } from '../db/models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { getAuthUserDtoById } from '../utils/authUser.js';
import { signAccessToken } from '../utils/jwt.js';

const router = Router();

const registerBodySchema = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
  role: z.string().optional(),
});

const loginBodySchema = z.object({
  email: z.string(),
  password: z.string(),
});

router.post('/register', async (req, res) => {
  const parsed = registerBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Необходимо указать email, пароль и имя' });
  }
  const rawEmail = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;
  const name = parsed.data.name.trim();
  if (!rawEmail || !password || !name) {
    return res.status(400).json({ error: 'Необходимо указать email, пароль и имя' });
  }
  const emailOk = z.string().email().safeParse(rawEmail);
  if (!emailOk.success) {
    return res.status(400).json({ error: 'Необходимо указать email, пароль и имя' });
  }
  const roleCode = parsed.data.role === 'teacher' ? 'TEACHER' : 'STUDENT';
  const passwordHash = await bcrypt.hash(password, 10);
  const t = await sequelize.transaction();
  let createdUser;
  try {
    createdUser = await User.create(
      { email: rawEmail, passwordHash, name },
      { transaction: t },
    );
    await UserRole.create({ userId: createdUser.id, roleCode }, { transaction: t });
    await t.commit();
  } catch (err) {
    await t.rollback();
    if (err && typeof err === 'object' && 'name' in err && err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Пользователь уже существует' });
    }
    throw err;
  }
  const dto = await getAuthUserDtoById(createdUser.id);
  if (!dto) {
    return res.status(500).json({ error: 'Не удалось создать пользователя' });
  }
  const token = signAccessToken(createdUser.id);
  return res.status(201).json({ token, user: dto });
});

router.post('/login', async (req, res) => {
  const parsed = loginBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Необходимо указать email и пароль' });
  }
  const email = parsed.data.email.trim().toLowerCase();
  const { password } = parsed.data;
  if (!email || !password) {
    return res.status(400).json({ error: 'Необходимо указать email и пароль' });
  }
  const user = await User.findOne({ where: { email } });
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) {
    return res.status(401).json({ error: 'Неверные учётные данные' });
  }
  const dto = await getAuthUserDtoById(user.id);
  if (!dto) {
    return res.status(401).json({ error: 'Неверные учётные данные' });
  }
  const token = signAccessToken(user.id);
  return res.status(200).json({ token, user: dto });
});

router.get('/me', requireAuth, (req, res) => {
  return res.status(200).json(req.authUser);
});

export default router;
