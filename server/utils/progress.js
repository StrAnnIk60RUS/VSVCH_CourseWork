import { Enrollment, Lesson, LessonCompletion } from '../db/models/index.js';

/**
 * @param {string} userId
 * @param {string} courseId
 */
export async function recalculateProgress(userId, courseId) {
  const [totalLessons, completedLessons] = await Promise.all([
    Lesson.count({ where: { courseId } }),
    LessonCompletion.count({
      where: { userId },
      include: [{ model: Lesson, as: 'lesson', where: { courseId }, required: true }],
    }),
  ]);

  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  await Enrollment.update({ progress }, { where: { userId, courseId } });
  return progress;
}
