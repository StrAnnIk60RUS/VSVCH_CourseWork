import { Router } from 'express';
import { z } from 'zod';
import { Course, CourseStaff, Favorite, User } from '../db/models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const createSchema = z.object({
  courseId: z.string(),
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const rows = await Favorite.findAll({
      where: { userId: req.authUser.id },
      include: [{ model: Course, as: 'course' }],
      order: [['createdAt', 'DESC']],
    });
    const items = await Promise.all(
      rows.map(async (row) => {
        const plain = row.get({ plain: true });
        const lead = await CourseStaff.findOne({
          where: { courseId: row.courseId, staffRole: 'TEACHER' },
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
          order: [['createdAt', 'ASC']],
        });
        const leadTeacher = lead?.user?.get({ plain: true }) ?? null;
        return {
          id: plain.id,
          courseId: plain.courseId,
          createdAt: plain.createdAt,
          course: plain.course,
          leadTeacher,
        };
      }),
    );
    return res.status(200).json({ items });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Некорректные данные' });
    }
    const course = await Course.findByPk(parsed.data.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    await Favorite.findOrCreate({
      where: { userId: req.authUser.id, courseId: parsed.data.courseId },
      defaults: { userId: req.authUser.id, courseId: parsed.data.courseId },
    });
    return res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:courseId', requireAuth, async (req, res, next) => {
  try {
    await Favorite.destroy({
      where: { userId: req.authUser.id, courseId: req.params.courseId },
    });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
