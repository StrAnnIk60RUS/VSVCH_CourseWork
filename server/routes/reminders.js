import { Router } from 'express';
import { z } from 'zod';
import { Reminder } from '../db/models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const createSchema = z.object({
  title: z.string().trim().min(1, 'title is required'),
  remindAt: z.string().datetime({ offset: true }),
  courseId: z.string().optional().nullable(),
});

const updateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  remindAt: z.string().datetime({ offset: true }).optional(),
  courseId: z.string().optional().nullable(),
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const items = await Reminder.findAll({
      where: { userId: req.authUser.id },
      order: [['remindAt', 'ASC']],
    });
    return res.status(200).json({ items: items.map((x) => x.get({ plain: true })) });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Некорректные данные напоминания' });
    }
    const remindAt = new Date(parsed.data.remindAt);
    if (Number.isNaN(remindAt.getTime())) {
      return res.status(400).json({ error: 'Некорректная дата напоминания' });
    }
    const reminder = await Reminder.create({
      userId: req.authUser.id,
      title: parsed.data.title.trim(),
      remindAt,
      courseId: parsed.data.courseId ?? null,
    });
    return res.status(201).json(reminder.get({ plain: true }));
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Некорректные данные напоминания' });
    }
    const reminder = await Reminder.findOne({
      where: { id: req.params.id, userId: req.authUser.id },
    });
    if (!reminder) {
      return res.status(404).json({ error: 'Напоминание не найдено' });
    }
    let remindAt = reminder.remindAt;
    if (parsed.data.remindAt !== undefined) {
      const date = new Date(parsed.data.remindAt);
      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({ error: 'Некорректная дата напоминания' });
      }
      remindAt = date;
    }
    await reminder.update({
      title: parsed.data.title?.trim() || reminder.title,
      remindAt,
      courseId: parsed.data.courseId !== undefined ? parsed.data.courseId : reminder.courseId,
    });
    return res.status(200).json(reminder.get({ plain: true }));
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const deleted = await Reminder.destroy({
      where: { id: req.params.id, userId: req.authUser.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Напоминание не найдено' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
