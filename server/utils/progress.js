import { Op } from 'sequelize';
import { Enrollment, Exercise, Lesson, Submission } from '../db/models/index.js';

function maxScoreForExercise(exercise) {
  const payload = exercise.payload ?? {};
  return Number(payload.maxScore ?? 10) || 10;
}

/**
 * Course progress = round(100 * sum(best score per exercise) / sum(maxScore per exercise)).
 *
 * @param {string} userId
 * @param {string} courseId
 */
export async function recalculateProgress(userId, courseId) {
  const lessons = await Lesson.findAll({
    where: { courseId },
    include: [{ model: Exercise, as: 'exercises', attributes: ['id', 'payload'] }],
  });

  const exercises = lessons.flatMap((l) => l.exercises ?? []);
  const exerciseIds = exercises.map((e) => e.id);
  const maxTotal = exercises.reduce((sum, ex) => sum + maxScoreForExercise(ex), 0);

  let earnedTotal = 0;
  if (exerciseIds.length > 0) {
    const rows = await Submission.findAll({
      where: { userId, exerciseId: { [Op.in]: exerciseIds } },
      attributes: ['exerciseId', 'score'],
    });
    const bestByExercise = {};
    for (const row of rows) {
      const id = row.exerciseId;
      const s = Number(row.score) || 0;
      bestByExercise[id] = Math.max(bestByExercise[id] ?? 0, s);
    }
    earnedTotal = exerciseIds.reduce((sum, id) => sum + (bestByExercise[id] ?? 0), 0);
  }

  const progress =
    maxTotal > 0 ? Math.min(100, Math.max(0, Math.round((earnedTotal / maxTotal) * 100))) : 0;

  await Enrollment.update({ progress }, { where: { userId, courseId } });
  return progress;
}
