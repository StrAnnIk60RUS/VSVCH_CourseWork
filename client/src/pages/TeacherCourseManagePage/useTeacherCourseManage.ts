import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createExercise,
  createLesson,
  deleteExercise,
  deleteLesson,
  downloadReport,
  downloadTeacherStudentsCsv,
  getApiError,
  getLessonExercises,
  getTeacherCourseById,
  getTeacherStudents,
  sendReportEmail,
  updateCourse,
  updateExercise,
  updateLesson,
} from '../../api';

export type CourseForm = { title: string; description: string; language: string; level: string };
export type ExerciseForm = { title: string; question: string; correctAnswer: string; maxScore: string };
export type LessonItem = { id: string; title: string; content?: string };
export type LessonEdit = { title: string; content: string };
export type ExerciseEditRow = { title: string; question: string; correctAnswer: string; maxScore: string };
export type StudentItem = { userId: string; name: string; email: string; progress: number; active: boolean };

export function useTeacherCourseManage(courseId: string) {
  const [course, setCourse] = useState<CourseForm & { lessons: LessonItem[] } | null>(null);
  const [exerciseMap, setExerciseMap] = useState<
    Record<string, Array<{ id: string; title: string; question?: string; maxScore?: number; correctAnswer?: string }>>
  >({});
  const [lessonEdits, setLessonEdits] = useState<Record<string, LessonEdit>>({});
  const [exerciseEdits, setExerciseEdits] = useState<Record<string, ExerciseEditRow>>({});
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [courseForm, setCourseForm] = useState<CourseForm>({ title: '', description: '', language: '', level: '' });
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [exerciseForms, setExerciseForms] = useState<Record<string, ExerciseForm>>({});
  const [busyAction, setBusyAction] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('name');
  const [status, setStatus] = useState('');

  const reloadCourse = useCallback(async () => {
    const res = await getTeacherCourseById(courseId);
    const nextCourse = {
      title: res.title,
      description: res.description ?? '',
      language: res.language ?? '',
      level: res.level ?? '',
      lessons: res.lessons,
    };
    setCourse(nextCourse);
    setCourseForm(nextCourse);
    const lessonExercises = await Promise.all(
      res.lessons.map(async (lesson) => {
        const list = await getLessonExercises(courseId, lesson.id);
        return [lesson.id, list.items] as const;
      }),
    );
    setExerciseMap(
      Object.fromEntries(
        lessonExercises.map(([lessonId, items]) => [
          lessonId,
          items.map((x) => ({
            id: x.id,
            title: x.title,
            question: x.question ?? x.payload?.question ?? '',
            correctAnswer: String(x.correctAnswer ?? x.payload?.correctAnswer ?? ''),
            maxScore: x.maxScore ?? x.payload?.maxScore ?? 0,
          })),
        ]),
      ),
    );
    const nextExerciseEdits: Record<string, ExerciseEditRow> = {};
    for (const [, items] of lessonExercises) {
      for (const x of items) {
        nextExerciseEdits[x.id] = {
          title: x.title,
          question: x.question ?? x.payload?.question ?? '',
          correctAnswer: String(x.correctAnswer ?? x.payload?.correctAnswer ?? ''),
          maxScore: String(x.maxScore ?? x.payload?.maxScore ?? 10),
        };
      }
    }
    setExerciseEdits(nextExerciseEdits);
    setLessonEdits(
      Object.fromEntries(res.lessons.map((l) => [l.id, { title: l.title, content: l.content ?? '' }])),
    );
    setExerciseForms((prev) => {
      const next = { ...prev };
      for (const lesson of res.lessons) {
        if (!next[lesson.id]) {
          next[lesson.id] = { title: '', question: '', correctAnswer: '', maxScore: '10' };
        }
      }
      return next;
    });
  }, [courseId]);

  const reloadStudents = useCallback(async () => {
    const res = await getTeacherStudents(courseId, { status: statusFilter, sort, order: 'asc' });
    setStudents(res.items);
  }, [courseId, sort, statusFilter]);

  useEffect(() => {
    reloadCourse().catch((err) => setStatus(getApiError(err)));
  }, [reloadCourse]);

  useEffect(() => {
    reloadStudents().catch((err) => setStatus(getApiError(err)));
  }, [reloadStudents]);

  const saveBlob = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const actions = useMemo(
    () => ({
      async updateCourse() {
        if (!courseForm.title.trim() || !courseForm.description.trim()) {
          setStatus('Название и описание курса обязательны.');
          return;
        }
        setBusyAction('course-update');
        try {
          await updateCourse(courseId, {
            title: courseForm.title.trim(),
            description: courseForm.description.trim(),
            language: courseForm.language.trim(),
            level: courseForm.level.trim(),
          });
          await reloadCourse();
          setStatus('Данные курса обновлены.');
        } catch (err) {
          setStatus(getApiError(err));
        } finally {
          setBusyAction('');
        }
      },
      async createLesson() {
        if (!lessonTitle.trim()) {
          setStatus('Введите название урока.');
          return;
        }
        setBusyAction('lesson-create');
        try {
          await createLesson(courseId, { title: lessonTitle.trim(), content: lessonContent.trim() });
          setLessonTitle('');
          setLessonContent('');
          await reloadCourse();
          setStatus('Урок создан.');
        } catch (err) {
          setStatus(getApiError(err));
        } finally {
          setBusyAction('');
        }
      },
      async deleteLesson(lesson: LessonItem) {
        if (!window.confirm(`Удалить урок "${lesson.title}"?`)) {
          return;
        }
        setBusyAction(`lesson-delete-${lesson.id}`);
        try {
          await deleteLesson(courseId, lesson.id);
          await reloadCourse();
          setStatus('Урок удален.');
        } catch (err) {
          setStatus(getApiError(err));
        } finally {
          setBusyAction('');
        }
      },
      async saveLesson(lesson: LessonItem) {
        const edit = lessonEdits[lesson.id] ?? { title: lesson.title, content: lesson.content ?? '' };
        if (!edit.title.trim()) {
          setStatus('Название урока не может быть пустым.');
          return;
        }
        setBusyAction(`lesson-update-${lesson.id}`);
        try {
          await updateLesson(courseId, lesson.id, { title: edit.title.trim(), content: edit.content.trim() });
          await reloadCourse();
          setStatus('Урок обновлён.');
        } catch (err) {
          setStatus(getApiError(err));
        } finally {
          setBusyAction('');
        }
      },
      async createExercise(lesson: LessonItem) {
        const form = exerciseForms[lesson.id] ?? { title: '', question: '', correctAnswer: '', maxScore: '10' };
        if (!form.title.trim() || !form.question.trim() || !form.correctAnswer.trim()) {
          setStatus('Заполните название, вопрос и правильный ответ упражнения.');
          return;
        }
        const parsedScore = Number(form.maxScore);
        if (!Number.isFinite(parsedScore) || parsedScore < 0) {
          setStatus('maxScore должен быть неотрицательным числом.');
          return;
        }
        setBusyAction(`exercise-create-${lesson.id}`);
        try {
          await createExercise(courseId, lesson.id, {
            title: form.title.trim(),
            question: form.question.trim(),
            correctAnswer: form.correctAnswer.trim(),
            maxScore: parsedScore,
          });
          setExerciseForms((prev) => ({
            ...prev,
            [lesson.id]: { title: '', question: '', correctAnswer: '', maxScore: '10' },
          }));
          await reloadCourse();
          setStatus(`Упражнение добавлено в урок "${lesson.title}".`);
        } catch (err) {
          setStatus(getApiError(err));
        } finally {
          setBusyAction('');
        }
      },
      async deleteExercise(lesson: LessonItem, exercise: { id: string; title: string }) {
        if (!window.confirm(`Удалить упражнение "${exercise.title}"?`)) {
          return;
        }
        setBusyAction(`exercise-delete-${exercise.id}`);
        try {
          await deleteExercise(courseId, lesson.id, exercise.id);
          await reloadCourse();
          setStatus('Упражнение удалено.');
        } catch (err) {
          setStatus(getApiError(err));
        } finally {
          setBusyAction('');
        }
      },
      async saveExercise(lesson: LessonItem, exerciseId: string) {
        const row = exerciseEdits[exerciseId];
        if (!row) {
          setStatus('Нет данных для сохранения упражнения.');
          return;
        }
        if (!row.title.trim() || !row.question.trim() || !row.correctAnswer.trim()) {
          setStatus('Заполните название, вопрос и правильный ответ.');
          return;
        }
        const parsedScore = Number(row.maxScore);
        if (!Number.isFinite(parsedScore) || parsedScore < 0) {
          setStatus('maxScore должен быть неотрицательным числом.');
          return;
        }
        setBusyAction(`exercise-update-${exerciseId}`);
        try {
          await updateExercise(courseId, lesson.id, exerciseId, {
            title: row.title.trim(),
            question: row.question.trim(),
            correctAnswer: row.correctAnswer.trim(),
            maxScore: parsedScore,
          });
          await reloadCourse();
          setStatus('Упражнение обновлено.');
        } catch (err) {
          setStatus(getApiError(err));
        } finally {
          setBusyAction('');
        }
      },
      async downloadStudentsCsv() {
        saveBlob(await downloadTeacherStudentsCsv(courseId), `course-${courseId}-students.csv`);
      },
      async downloadCourseReport(format: 'pdf' | 'docx') {
        saveBlob(await downloadReport('course-summary', format, courseId), `course-${courseId}.${format}`);
      },
      async sendCourseReportEmail() {
        const email = prompt('Email для отправки отчета');
        if (!email) {
          return;
        }
        const res = await sendReportEmail({ email, type: 'course-summary', format: 'pdf', courseId });
        setStatus(res.message ?? (res.sent ? 'Письмо отправлено' : 'Demo-режим'));
      },
    }),
    [courseForm, courseId, exerciseEdits, exerciseForms, lessonContent, lessonEdits, lessonTitle, reloadCourse, saveBlob],
  );

  return {
    course,
    exerciseMap,
    lessonEdits,
    exerciseEdits,
    students,
    courseForm,
    lessonTitle,
    lessonContent,
    exerciseForms,
    busyAction,
    statusFilter,
    sort,
    status,
    setCourseForm,
    setLessonTitle,
    setLessonContent,
    setExerciseForms,
    setLessonEdits,
    setExerciseEdits,
    setStatusFilter,
    setSort,
    setStatus,
    actions,
  };
}
