import { Router } from 'express';
import { z } from 'zod';
import { Course, Exercise, Lesson } from '../db/models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { canManageCourse, hasRole } from '../utils/permissions.js';

const router = Router();

const createBodySchema = z.object({
  title: z.string().optional(),
  question: z.string().optional(),
  type: z.string().default('text'),
  correctAnswer: z.union([z.string(), z.number(), z.boolean()]).optional(),
  maxScore: z.coerce.number().int().min(0).optional(),
  payload: z.record(z.any()).optional(),
});

function mapExercise(exercise) {
  const plain = exercise.get({ plain: true });
  return {
    id: plain.id,
    lessonId: plain.lessonId,
    title: plain.title,
    type: plain.type,
    payload: plain.payload ?? {},
  };
}

async function ensureLessonContext(courseId, lessonId) {
  const lesson = await Lesson.findOne({ where: { id: lessonId, courseId } });
  return lesson;
}

router.get('/', async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    const lesson = await ensureLessonContext(courseId, lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Урок не найден' });
    }
    const exercises = await Exercise.findAll({ where: { lessonId } });
    return res.status(200).json({ items: exercises.map(mapExercise) });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'TEACHER')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId, lessonId } = req.params;
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const lesson = await ensureLessonContext(courseId, lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Урок не найден' });
    }
    const parsed = createBodySchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return res.status(400).json({ error: 'Некорректные данные упражнения' });
    }
    const payload = parsed.data.payload ?? {};
    const question = parsed.data.question ?? '';
    const correctAnswer = parsed.data.correctAnswer !== undefined ? String(parsed.data.correctAnswer) : '';
    const maxScore = parsed.data.maxScore ?? 10;
    const exercise = await Exercise.create({
      lessonId,
      title: parsed.data.title?.trim() || 'Exercise',
      type: parsed.data.type,
      payload: { ...payload, question, correctAnswer, maxScore },
    });
    return res.status(201).json(mapExercise(exercise));
  } catch (err) {
    next(err);
  }
});

router.put('/:exerciseId', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'TEACHER')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId, lessonId, exerciseId } = req.params;
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const lesson = await ensureLessonContext(courseId, lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Урок не найден' });
    }
    const parsed = createBodySchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return res.status(400).json({ error: 'Некорректные данные упражнения' });
    }
    const exercise = await Exercise.findOne({ where: { id: exerciseId, lessonId } });
    if (!exercise) {
      return res.status(404).json({ error: 'Упражнение не найдено' });
    }
    const current = exercise.payload ?? {};
    const nextPayload = {
      ...current,
      ...(parsed.data.payload ?? {}),
      question: parsed.data.question ?? current.question ?? '',
      correctAnswer:
        parsed.data.correctAnswer !== undefined
          ? String(parsed.data.correctAnswer)
          : (current.correctAnswer ?? ''),
      maxScore: parsed.data.maxScore ?? current.maxScore ?? 10,
    };
    await exercise.update({
      title: parsed.data.title?.trim() || exercise.title,
      type: parsed.data.type ?? exercise.type,
      payload: nextPayload,
    });
    return res.status(200).json(mapExercise(exercise));
  } catch (err) {
    next(err);
  }
});

router.delete('/:exerciseId', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'TEACHER')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId, lessonId, exerciseId } = req.params;
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const lesson = await ensureLessonContext(courseId, lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Урок не найден' });
    }
    const exercise = await Exercise.findOne({ where: { id: exerciseId, lessonId } });
    if (!exercise) {
      return res.status(404).json({ error: 'Упражнение не найдено' });
    }
    await exercise.destroy();
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
