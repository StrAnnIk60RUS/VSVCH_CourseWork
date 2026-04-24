import type * as React from 'react';
import type { ExerciseEditRow, ExerciseForm, LessonEdit, LessonItem } from './useTeacherCourseManage';

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
        className="mb-4 grid gap-2 rounded border border-slate-200 p-3 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          await onSaveCourse();
        }}
      >
        <input
          value={courseForm.title}
          onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))}
          className="rounded border border-slate-300 px-3 py-2"
          placeholder="Название курса"
        />
        <input
          value={courseForm.language}
          onChange={(e) => setCourseForm((prev) => ({ ...prev, language: e.target.value }))}
          className="rounded border border-slate-300 px-3 py-2"
          placeholder="Язык"
        />
        <input
          value={courseForm.level}
          onChange={(e) => setCourseForm((prev) => ({ ...prev, level: e.target.value }))}
          className="rounded border border-slate-300 px-3 py-2"
          placeholder="Уровень"
        />
        <textarea
          value={courseForm.description}
          onChange={(e) => setCourseForm((prev) => ({ ...prev, description: e.target.value }))}
          className="rounded border border-slate-300 px-3 py-2 md:col-span-2"
          placeholder="Описание курса"
          rows={2}
        />
        <button type="submit" className="rounded border border-slate-300 px-3 py-2" disabled={busyAction === 'course-update'}>
          {busyAction === 'course-update' ? 'Сохранение...' : 'Сохранить курс'}
        </button>
      </form>

      <form
        className="mb-3 grid gap-2 rounded border border-slate-200 p-3 md:grid-cols-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await onCreateLesson();
        }}
      >
        <input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} className="rounded border border-slate-300 px-3 py-2" placeholder="Название урока" />
        <input
          value={lessonContent}
          onChange={(e) => setLessonContent(e.target.value)}
          className="rounded border border-slate-300 px-3 py-2"
          placeholder="Описание/контент урока (опционально)"
        />
        <button type="submit" className="rounded border border-slate-300 px-3 py-2" disabled={busyAction === 'lesson-create'}>
          {busyAction === 'lesson-create' ? 'Создание...' : 'Добавить урок'}
        </button>
      </form>

      <ul className="space-y-2">
        {lessons.map((lesson) => (
          <li key={lesson.id} className="rounded border border-slate-200 p-3">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <span className="font-medium text-slate-600">Урок</span>
              <button
                type="button"
                onClick={() => onDeleteLesson(lesson)}
                className="rounded border border-slate-300 px-2 py-1"
                disabled={busyAction === `lesson-delete-${lesson.id}`}
              >
                {busyAction === `lesson-delete-${lesson.id}` ? 'Удаление...' : 'Удалить урок'}
              </button>
            </div>
            <div className="mt-2 grid gap-2 rounded border border-slate-100 p-2 md:grid-cols-2">
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
                className="rounded border border-slate-300 px-2 py-1 text-sm"
                placeholder="Название урока"
              />
              <button
                type="button"
                onClick={() => onSaveLesson(lesson)}
                className="rounded border border-slate-300 px-2 py-1 text-sm"
                disabled={busyAction === `lesson-update-${lesson.id}`}
              >
                {busyAction === `lesson-update-${lesson.id}` ? 'Сохранение...' : 'Сохранить урок'}
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
                className="rounded border border-slate-300 px-2 py-1 text-sm md:col-span-2"
                placeholder="Контент урока"
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
                  <div key={exercise.id} className="space-y-2 rounded border border-slate-200 p-2 text-sm">
                    <div className="grid gap-2 md:grid-cols-2">
                      <input
                        value={row.title}
                        onChange={(e) =>
                          setExerciseEdits((prev) => ({
                            ...prev,
                            [exercise.id]: { ...row, title: e.target.value },
                          }))
                        }
                        className="rounded border border-slate-300 px-2 py-1"
                        placeholder="Название"
                      />
                      <input
                        value={row.maxScore}
                        onChange={(e) =>
                          setExerciseEdits((prev) => ({
                            ...prev,
                            [exercise.id]: { ...row, maxScore: e.target.value },
                          }))
                        }
                        className="rounded border border-slate-300 px-2 py-1"
                        placeholder="Баллы"
                      />
                      <input
                        value={row.question}
                        onChange={(e) =>
                          setExerciseEdits((prev) => ({
                            ...prev,
                            [exercise.id]: { ...row, question: e.target.value },
                          }))
                        }
                        className="rounded border border-slate-300 px-2 py-1 md:col-span-2"
                        placeholder="Вопрос"
                      />
                      <input
                        value={row.correctAnswer}
                        onChange={(e) =>
                          setExerciseEdits((prev) => ({
                            ...prev,
                            [exercise.id]: { ...row, correctAnswer: e.target.value },
                          }))
                        }
                        className="rounded border border-slate-300 px-2 py-1 md:col-span-2"
                        placeholder="Правильный ответ"
                      />
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onSaveExercise(lesson, exercise.id)}
                        className="rounded border border-slate-300 px-2 py-1"
                        disabled={busyAction === `exercise-update-${exercise.id}`}
                      >
                        {busyAction === `exercise-update-${exercise.id}` ? 'Сохранение...' : 'Сохранить'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteExercise(lesson, exercise)}
                        className="rounded border border-slate-300 px-2 py-1"
                        disabled={busyAction === `exercise-delete-${exercise.id}`}
                      >
                        {busyAction === `exercise-delete-${exercise.id}` ? 'Удаление...' : 'Удалить'}
                      </button>
                    </div>
                  </div>
                );
              })}
              <form
                className="grid gap-2 rounded border border-slate-200 p-2 md:grid-cols-2"
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
                  className="rounded border border-slate-300 px-2 py-1"
                  placeholder="Название упражнения"
                />
                <input
                  value={exerciseForms[lesson.id]?.maxScore ?? '10'}
                  onChange={(e) =>
                    setExerciseForms((prev) => ({
                      ...prev,
                      [lesson.id]: { ...(prev[lesson.id] ?? { title: '', question: '', correctAnswer: '', maxScore: '10' }), maxScore: e.target.value },
                    }))
                  }
                  className="rounded border border-slate-300 px-2 py-1"
                  placeholder="Баллы (maxScore)"
                />
                <input
                  value={exerciseForms[lesson.id]?.question ?? ''}
                  onChange={(e) =>
                    setExerciseForms((prev) => ({
                      ...prev,
                      [lesson.id]: { ...(prev[lesson.id] ?? { title: '', question: '', correctAnswer: '', maxScore: '10' }), question: e.target.value },
                    }))
                  }
                  className="rounded border border-slate-300 px-2 py-1"
                  placeholder="Вопрос"
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
                  className="rounded border border-slate-300 px-2 py-1"
                  placeholder="Правильный ответ"
                />
                <button
                  type="submit"
                  className="rounded border border-slate-300 px-2 py-1 md:col-span-2"
                  disabled={busyAction === `exercise-create-${lesson.id}`}
                >
                  {busyAction === `exercise-create-${lesson.id}` ? 'Добавление...' : 'Добавить упражнение в урок'}
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
