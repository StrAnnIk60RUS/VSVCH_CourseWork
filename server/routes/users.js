import { Router } from 'express';
import { z } from 'zod';
import { User } from '../db/models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const updateSchema = z.object({
  name: z.string(),
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.authUser.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    const plain = user.get({ plain: true });
    return res.status(200).json({
      id: plain.id,
      email: plain.email,
      name: plain.name,
      createdAt: plain.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

router.put('/', requireAuth, async (req, res, next) => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success || !parsed.data.name.trim()) {
      return res.status(400).json({ error: 'Некорректные данные профиля' });
    }
    const user = await User.findByPk(req.authUser.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    await user.update({ name: parsed.data.name.trim() });
    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
