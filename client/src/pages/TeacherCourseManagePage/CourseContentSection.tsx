import type * as React from 'react';
import type { ExerciseEditRow, ExerciseForm, LessonEdit, LessonItem } from './useTeacherCourseManage';
import { COURSE_LANGUAGE_OPTIONS, COURSE_LEVEL_OPTIONS } from '../../constants/courseOptions';
import { useI18n } from '../../hooks/useI18n';

type Props = {
  courseForm: { title: string; description: string; language: string; level: string };
  lessonTitle: string;
  lessonContent: string;
  lessons: LessonItem[];
  exerciseMap: Record<
    string,
    Array<{ id: string; title: string; question?: string; maxScore?: number; correctAnswer?: string }>
  >;
  lessonEdits: Record<string, LessonEdit>;
  exerciseEdits: Record<string, ExerciseEditRow>;
  exerciseForms: Record<string, ExerciseForm>;
  busyAction: string;
  setCourseForm: React.Dispatch<
    React.SetStateAction<{ title: string; description: string; language: string; level: string }>
  >;
  setLessonTitle: React.Dispatch<React.SetStateAction<string>>;
  setLessonContent: React.Dispatch<React.SetStateAction<string>>;
  setLessonEdits: React.Dispatch<React.SetStateAction<Record<string, LessonEdit>>>;
  setExerciseEdits: React.Dispatch<React.SetStateAction<Record<string, ExerciseEditRow>>>;
  setExerciseForms: React.Dispatch<React.SetStateAction<Record<string, ExerciseForm>>>;
  onSaveCourse: () => Promise<void>;
  onCreateLesson: () => Promise<void>;
  onDeleteLesson: (lesson: LessonItem) => Promise<void>;
  onSaveLesson: (lesson: LessonItem) => Promise<void>;
  onCreateExercise: (lesson: LessonItem) => Promise<void>;
  onDeleteExercise: (lesson: LessonItem, exercise: { id: string; title: string }) => Promise<void>;
  onSaveExercise: (lesson: LessonItem, exerciseId: string) => Promise<void>;
};

export function CourseContentSection(props: Props) {
  const t = useI18n();
  const {
    courseForm,
    lessonTitle,
    lessonContent,
    lessons,
    exerciseMap,
    lessonEdits,
    exerciseEdits,
    exerciseForms,
    busyAction,
    setCourseForm,
    setLessonTitle,
    setLessonContent,
    setLessonEdits,
    setExerciseEdits,
    setExerciseForms,
    onSaveCourse,
    onCreateLesson,
    onDeleteLesson,
    onSaveLesson,
    onCreateExercise,
    onDeleteExercise,
    onSaveExercise,
  } = props;

  return (
    <>
      <form
        className="mb-4 grid gap-2 rounded border border-ui-border bg-ui-surface p-3 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          await onSaveCourse();
        }}
      >
        <input
          value={courseForm.title}
          onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))}
          className="ui-input rounded px-3 py-2"
          placeholder={t.teacherContent.courseTitle}
        />
        <select
          value={courseForm.language}
          onChange={(e) => setCourseForm((prev) => ({ ...prev, language: e.target.value }))}
          className="ui-input rounded px-3 py-2"
          aria-label={t.teacherContent.language}
        >
          {COURSE_LANGUAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={courseForm.level}
          onChange={(e) => setCourseForm((prev) => ({ ...prev, level: e.target.value }))}
          className="ui-input rounded px-3 py-2"
          aria-label={t.teacherContent.level}
        >
          {COURSE_LEVEL_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <textarea
          value={courseForm.description}
          onChange={(e) => setCourseForm((prev) => ({ ...prev, description: e.target.value }))}
          className="ui-input rounded px-3 py-2 md:col-span-2"
          placeholder={t.teacherContent.courseDescription}
          rows={2}
        />
        <button type="submit" className="ui-btn-primary" disabled={busyAction === 'course-update'}>
          {busyAction === 'course-update' ? t.teacherContent.savePending : t.teacherContent.saveCourse}
        </button>
      </form>

      <form
        className="mb-3 grid gap-2 rounded border border-ui-border bg-ui-surface p-3 md:grid-cols-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await onCreateLesson();
        }}
      >
        <input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} className="ui-input rounded px-3 py-2" placeholder={t.teacherContent.lessonTitle} />
        <input
          value={lessonContent}
          onChange={(e) => setLessonContent(e.target.value)}
          className="ui-input rounded px-3 py-2"
          placeholder={t.teacherContent.lessonContentOptional}
        />
        <button type="submit" className="ui-btn-primary" disabled={busyAction === 'lesson-create'}>
          {busyAction === 'lesson-create' ? t.teacherContent.createPending : t.teacherContent.addLesson}
        </button>
      </form>

      <ul className="space-y-2">
        {lessons.map((lesson) => (
          <li
            key={lesson.id}
            className="ui-card-interactive rounded border border-ui-border bg-ui-surface p-3"
          >
            <div className="flex items-center justify-between gap-2 border-b border-ui-border pb-2">
              <span className="font-medium text-ui-muted">{t.teacherContent.lesson}</span>
              <button
                type="button"
                onClick={() => onDeleteLesson(lesson)}
                className="ui-btn-danger text-sm"
                disabled={busyAction === `lesson-delete-${lesson.id}`}
              >
                {busyAction === `lesson-delete-${lesson.id}` ? t.teacherContent.deletePending : t.teacherContent.deleteLesson}
              </button>
            </div>
            <div className="mt-2 grid gap-2 rounded border border-ui-border bg-ui-subtle p-2 md:grid-cols-2">
              <input
                value={lessonEdits[lesson.id]?.title ?? lesson.title}
                onChange={(e) =>
                  setLessonEdits((prev) => ({
                    ...prev,
                    [lesson.id]: {
                      title: e.target.value,
                      content: prev[lesson.id]?.content ?? lesson.content ?? '',
                    },
                  }))
                }
                className="ui-input rounded px-2 py-1 text-sm"
                placeholder={t.teacherContent.lessonTitle}
              />
              <button
                type="button"
                onClick={() => onSaveLesson(lesson)}
                className="ui-btn-primary text-sm"
                disabled={busyAction === `lesson-update-${lesson.id}`}
              >
                {busyAction === `lesson-update-${lesson.id}` ? t.teacherContent.savePending : t.teacherContent.saveLesson}
              </button>
              <textarea
                value={lessonEdits[lesson.id]?.content ?? lesson.content ?? ''}
                onChange={(e) =>
                  setLessonEdits((prev) => ({
                    ...prev,
                    [lesson.id]: {
                      title: prev[lesson.id]?.title ?? lesson.title,
                      content: e.target.value,
                    },
                  }))
                }
                className="ui-input rounded px-2 py-1 text-sm md:col-span-2"
                placeholder={t.teacherContent.lessonContent}
                rows={2}
              />
            </div>
            <div className="mt-3 space-y-2">
              {(exerciseMap[lesson.id] ?? []).map((exercise) => {
                const row = exerciseEdits[exercise.id] ?? {
                  title: exercise.title,
                  question: exercise.question ?? '',
                  correctAnswer: exercise.correctAnswer ?? '',
                  maxScore: String(exercise.maxScore ?? 10),
                };
                return (
                  <div
                    key={exercise.id}
                    className="ui-card-interactive space-y-2 rounded border border-ui-border bg-ui-surface p-2 text-sm"
                  >
                    <div className="grid gap-2 md:grid-cols-2">
                      <input
                        value={row.title}
                        onChange={(e) =>
                          setExerciseEdits((prev) => ({
                            ...prev,
                            [exercise.id]: { ...row, title: e.target.value },
                          }))
                        }
                        className="ui-input rounded px-2 py-1"
                        placeholder={t.teacherContent.exerciseTitle}
                      />
                      <input
                        value={row.maxScore}
                        onChange={(e) =>
                          setExerciseEdits((prev) => ({
                            ...prev,
                            [exercise.id]: { ...row, maxScore: e.target.value },
                          }))
                        }
                        className="ui-input rounded px-2 py-1"
                        placeholder={t.teacherContent.points}
                      />
                      <input
                        value={row.question}
                        onChange={(e) =>
                          setExerciseEdits((prev) => ({
                            ...prev,
                            [exercise.id]: { ...row, question: e.target.value },
                          }))
                        }
                        className="ui-input rounded px-2 py-1 md:col-span-2"
                        placeholder={t.teacherContent.question}
                      />
                      <input
                        value={row.correctAnswer}
                        onChange={(e) =>
                          setExerciseEdits((prev) => ({
                            ...prev,
                            [exercise.id]: { ...row, correctAnswer: e.target.value },
                          }))
                        }
                        className="ui-input rounded px-2 py-1 md:col-span-2"
                        placeholder={t.teacherContent.correctAnswer}
                      />
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onSaveExercise(lesson, exercise.id)}
                        className="ui-btn-primary text-sm"
                        disabled={busyAction === `exercise-update-${exercise.id}`}
                      >
                        {busyAction === `exercise-update-${exercise.id}` ? t.teacherContent.savePending : t.teacherContent.save}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteExercise(lesson, exercise)}
                        className="ui-btn-danger text-sm"
                        disabled={busyAction === `exercise-delete-${exercise.id}`}
                      >
                        {busyAction === `exercise-delete-${exercise.id}` ? t.teacherContent.deletePending : t.teacherContent.delete}
                      </button>
                    </div>
                  </div>
                );
              })}
              <form
                className="grid gap-2 rounded border border-ui-border bg-ui-surface p-2 md:grid-cols-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await onCreateExercise(lesson);
                }}
              >
                <input
                  value={exerciseForms[lesson.id]?.title ?? ''}
                  onChange={(e) =>
                    setExerciseForms((prev) => ({
                      ...prev,
                      [lesson.id]: { ...(prev[lesson.id] ?? { title: '', question: '', correctAnswer: '', maxScore: '10' }), title: e.target.value },
                    }))
                  }
                  className="ui-input rounded px-2 py-1"
                  placeholder={t.teacherContent.addExerciseTitle}
                />
                <input
                  value={exerciseForms[lesson.id]?.maxScore ?? '10'}
                  onChange={(e) =>
                    setExerciseForms((prev) => ({
                      ...prev,
                      [lesson.id]: { ...(prev[lesson.id] ?? { title: '', question: '', correctAnswer: '', maxScore: '10' }), maxScore: e.target.value },
                    }))
                  }
                  className="ui-input rounded px-2 py-1"
                  placeholder={t.teacherContent.addPoints}
                />
                <input
                  value={exerciseForms[lesson.id]?.question ?? ''}
                  onChange={(e) =>
                    setExerciseForms((prev) => ({
                      ...prev,
                      [lesson.id]: { ...(prev[lesson.id] ?? { title: '', question: '', correctAnswer: '', maxScore: '10' }), question: e.target.value },
                    }))
                  }
                  className="ui-input rounded px-2 py-1"
                  placeholder={t.teacherContent.question}
                />
                <input
                  value={exerciseForms[lesson.id]?.correctAnswer ?? ''}
                  onChange={(e) =>
                    setExerciseForms((prev) => ({
                      ...prev,
                      [lesson.id]: {
                        ...(prev[lesson.id] ?? { title: '', question: '', correctAnswer: '', maxScore: '10' }),
                        correctAnswer: e.target.value,
                      },
                    }))
                  }
                  className="ui-input rounded px-2 py-1"
                  placeholder={t.teacherContent.correctAnswer}
                />
                <button
                  type="submit"
                  className="ui-btn-primary text-sm md:col-span-2"
                  disabled={busyAction === `exercise-create-${lesson.id}`}
                >
                  {busyAction === `exercise-create-${lesson.id}` ? t.teacherContent.addPending : t.teacherContent.addExercise}
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
