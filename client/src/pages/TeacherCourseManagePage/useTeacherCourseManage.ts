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
} from '../../api';

export type CourseForm = { title: string; description: string; language: string; level: string };
export type ExerciseForm = { title: string; question: string; correctAnswer: string; maxScore: string };
export type LessonItem = { id: string; title: string };
export type StudentItem = { userId: string; name: string; email: string; progress: number; active: boolean };

export function useTeacherCourseManage(courseId: string) {
  const [course, setCourse] = useState<CourseForm & { lessons: LessonItem[] } | null>(null);
  const [exerciseMap, setExerciseMap] = useState<Record<string, Array<{ id: string; title: string; question?: string; maxScore?: number }>>>({});
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
            maxScore: x.maxScore ?? x.payload?.maxScore ?? 0,
          })),
        ]),
      ),
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
    [courseForm, courseId, exerciseForms, lessonContent, lessonTitle, reloadCourse, saveBlob],
  );

  return {
    course,
    exerciseMap,
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
    setStatusFilter,
    setSort,
    setStatus,
    actions,
  };
}
