import { Router } from 'express';
import { z } from 'zod';
import { Course, Favorite } from '../db/models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { getLeadTeachersByCourseIds } from '../services/courseStaffService.js';

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
    const plainRows = rows.map((row) => row.get({ plain: true }));
    const leadByCourseId = await getLeadTeachersByCourseIds(plainRows.map((row) => row.courseId));
    const items = plainRows.map((plain) => ({
      id: plain.id,
      courseId: plain.courseId,
      createdAt: plain.createdAt,
      course: plain.course,
      leadTeacher: leadByCourseId[plain.courseId]?.get({ plain: true }) ?? null,
    }));
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
