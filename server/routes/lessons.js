import { Router } from 'express';
import { z } from 'zod';
import { Course, Lesson } from '../db/models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { canManageCourse, hasRole } from '../utils/permissions.js';

const router = Router({ mergeParams: true });

const createBodySchema = z.object({
  title: z.string().trim().min(1, 'title is required'),
  content: z.string().optional(),
  order: z.coerce.number().int().min(1).optional(),
});

const updateBodySchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    content: z.string().optional(),
    order: z.coerce.number().int().min(1).optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined || data.order !== undefined, {
    message: 'At least one field is required',
  });

function validationError(message, parsed) {
  return {
    error: message,
    details: parsed.error.issues.map((issue) => ({
      path: issue.path.join('.') || 'body',
      message: issue.message,
    })),
  };
}

function mapLesson(lesson) {
  const plain = lesson.get({ plain: true });
  return {
    id: plain.id,
    title: plain.title,
    content: plain.content,
    order: plain.sortOrder,
  };
}

router.get('/', async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    const lessons = await Lesson.findAll({ where: { courseId }, order: [['sortOrder', 'ASC']] });
    return res.status(200).json({ items: lessons.map(mapLesson) });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'TEACHER')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId } = req.params;
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const parsed = createBodySchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return res.status(400).json(validationError('Некорректные данные урока', parsed));
    }
    const title = parsed.data.title.trim();
    const content = parsed.data.content ?? '';
    let sortOrder = parsed.data.order;
    if (!sortOrder) {
      const max = await Lesson.max('sortOrder', { where: { courseId } });
      sortOrder = Number.isFinite(max) ? Number(max) + 1 : 1;
    }
    const lesson = await Lesson.create({
      courseId,
      title,
      content,
      sortOrder,
    });
    return res.status(201).json(mapLesson(lesson));
  } catch (err) {
    next(err);
  }
});

router.put('/:lessonId', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'TEACHER')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId, lessonId } = req.params;
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const lesson = await Lesson.findOne({ where: { id: lessonId, courseId } });
    if (!lesson) {
      return res.status(404).json({ error: 'Урок не найден' });
    }
    const parsed = updateBodySchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return res.status(400).json(validationError('Некорректные данные урока', parsed));
    }
    await lesson.update({
      title: parsed.data.title?.trim() || lesson.title,
      content: parsed.data.content ?? lesson.content,
      sortOrder: parsed.data.order ?? lesson.sortOrder,
    });
    return res.status(200).json(mapLesson(lesson));
  } catch (err) {
    next(err);
  }
});

router.delete('/:lessonId', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'TEACHER')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId, lessonId } = req.params;
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const lesson = await Lesson.findOne({ where: { id: lessonId, courseId } });
    if (!lesson) {
      return res.status(404).json({ error: 'Урок не найден' });
    }
    await lesson.destroy();
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
