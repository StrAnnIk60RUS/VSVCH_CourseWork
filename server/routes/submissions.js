import { Router } from 'express';
import { col } from 'sequelize';
import { z } from 'zod';
import { Enrollment, Exercise, Lesson, Submission } from '../db/models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { recalculateProgress } from '../utils/progress.js';

const router = Router();

const createSchema = z.object({
  exerciseId: z.string(),
  answer: z.union([z.string(), z.number(), z.boolean()]),
});

function normalizeAnswer(v) {
  return String(v).trim().toLowerCase().replace(/\s+/g, ' ');
}

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Некорректные данные отправки' });
    }
    const exercise = await Exercise.findByPk(parsed.data.exerciseId, {
      include: [{ model: Lesson, as: 'lesson', attributes: ['id', 'courseId'] }],
    });
    if (!exercise || !exercise.lesson) {
      return res.status(404).json({ error: 'Упражнение не найдено' });
    }
    const enrollment = await Enrollment.findOne({
      where: { userId: req.authUser.id, courseId: exercise.lesson.courseId },
    });
    if (!enrollment) {
      return res.status(403).json({ error: 'Сначала запишитесь на курс' });
    }
    const payload = exercise.payload ?? {};
    const expected = normalizeAnswer(payload.correctAnswer ?? '');
    const answer = normalizeAnswer(parsed.data.answer);
    const maxScore = Number(payload.maxScore ?? 10) || 10;
    const correct = expected !== '' && expected === answer;
    const score = correct ? maxScore : 0;

    const submission = await Submission.create({
      userId: req.authUser.id,
      exerciseId: exercise.id,
      score,
      payload: {
        answer: String(parsed.data.answer),
        correct,
      },
    });
    const progress = await recalculateProgress(req.authUser.id, exercise.lesson.courseId);
    return res.status(201).json({
      id: submission.id,
      exerciseId: submission.exerciseId,
      score: submission.score,
      correct,
      progress,
      createdAt: submission.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const rows = await Submission.findAll({
      where: { userId: req.authUser.id },
      include: [
        {
          model: Exercise,
          as: 'exercise',
          attributes: ['id', 'title', 'type', 'lessonId'],
          include: [{ model: Lesson, as: 'lesson', attributes: ['id', 'title', 'courseId'] }],
        },
      ],
      order: [[col('Submission.created_at'), 'DESC']],
      limit: 200,
    });
    const items = rows.map((row) => {
      const plain = row.get({ plain: true });
      return {
        id: plain.id,
        exerciseId: plain.exerciseId,
        score: plain.score,
        payload: plain.payload,
        createdAt: plain.createdAt,
        exercise: plain.exercise,
      };
    });
    return res.status(200).json({ items });
  } catch (err) {
    next(err);
  }
});

export default router;
