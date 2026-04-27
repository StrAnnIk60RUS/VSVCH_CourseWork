import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  completeLesson,
  enrollToCourse,
  getApiError,
  getEnrollments,
  getLessonExercises,
  submitExercise,
} from '../../api';
import { NavigationUp, PageShell, SectionCard } from '../../components/layout';
import { useAppSelector } from '../../store/hooks';

type ExerciseItem = { id: string; title: string; payload?: { question?: string } };

export default function LessonPage() {
  const { courseId = '', lessonId = '' } = useParams();
  const user = useAppSelector((s) => s.app.user);
  const isStudent = Boolean(user?.roles.includes('STUDENT'));
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [exerciseResults, setExerciseResults] = useState<Record<string, { correct: boolean; score: number }>>({});
  const [isEnrolledInCourse, setIsEnrolledInCourse] = useState<boolean | null>(null);
  const [enrollBusy, setEnrollBusy] = useState(false);

  const loadingEnrollment = isStudent && isEnrolledInCourse === null;
  const canActOnCourse = isStudent && isEnrolledInCourse === true;

  useEffect(() => {
    getLessonExercises(courseId, lessonId)
      .then((res) => setExercises(res.items))
      .catch((err) => setError(getApiError(err)));
  }, [courseId, lessonId]);

  useEffect(() => {
    if (!courseId) {
      setIsEnrolledInCourse(null);
      return;
    }
    let active = true;
    setIsEnrolledInCourse(null);
    getEnrollments()
      .then((res) => {
        if (!active) return;
        setIsEnrolledInCourse(res.items.some((i) => i.courseId === courseId));
      })
      .catch(() => {
        if (!active) return;
        setIsEnrolledInCourse(null);
      });
    return () => {
      active = false;
    };
  }, [courseId]);

  useEffect(() => {
    if (!courseId || !isStudent || !isEnrolledInCourse) return;
    let active = true;
    getEnrollments()
      .then((res) => {
        if (!active) return;
        const en = res.items.find((i) => i.courseId === courseId);
        if (en) setProgress(en.progress);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [courseId, isStudent, isEnrolledInCourse]);

  const upLinks = [
    { to: `/courses/${courseId}`, label: 'К курсу' },
    { to: '/courses', label: 'Все курсы' },
    ...(isStudent ? ([{ to: '/me/learning', label: 'Моё обучение' }] as const) : []),
  ];

  return (
    <PageShell title="Урок" description="Контент урока, упражнения и фиксация прогресса.">
      <div className="space-y-4">
        <NavigationUp links={upLinks} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {actionError && <p className="text-sm text-red-600">{actionError}</p>}
        {isStudent && isEnrolledInCourse === false && (
          <SectionCard title="Запись на курс">
            <p className="text-sm text-slate-600">
              Чтобы отмечать урок и отправлять ответы, нужна запись на этот курс.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={enrollBusy}
                onClick={async () => {
                  setActionError('');
                  setEnrollBusy(true);
                  try {
                    await enrollToCourse(courseId);
                    setIsEnrolledInCourse(true);
                  } catch (err) {
                    setActionError(getApiError(err));
                  } finally {
                    setEnrollBusy(false);
                  }
                }}
                className="rounded border border-slate-300 px-3 py-2 disabled:opacity-60"
              >
                Записаться на курс
              </button>
              <Link
                to={`/courses/${courseId}`}
                className="inline-flex items-center rounded border border-slate-300 px-3 py-2 text-sm text-brand-700"
              >
                Открыть карточку курса
              </Link>
            </div>
          </SectionCard>
        )}
        <SectionCard title="Действия прогресса">
          <p className="text-sm text-slate-600">
            Прогресс курса в процентах — это доля набранных баллов от максимума по всем упражнениям курса (для
            каждого вопроса учитывается лучшая попытка). Кнопка ниже отмечает урок пройденным для отчётности; процент
            при этом пересчитывается на сервере, но меняется он только за счёт баллов за упражнения, а не из-за самой
            отметки.
          </p>
          {loadingEnrollment && <p className="mt-2 text-sm text-slate-500">Проверяем запись на курс…</p>}
          <button
            type="button"
            disabled={loadingEnrollment || !canActOnCourse}
            onClick={async () => {
              setActionError('');
              try {
                const res = await completeLesson(courseId, lessonId);
                setProgress(res.progress);
              } catch (err) {
                setActionError(getApiError(err));
              }
            }}
            className="mt-3 rounded border border-slate-300 px-3 py-2 disabled:opacity-50"
          >
            Отметить урок как пройденный
          </button>
          {progress !== null && <p className="mt-2 text-sm">Текущий прогресс курса: {progress}%</p>}
        </SectionCard>
        <SectionCard title="Упражнения">
          {!isStudent && (
            <p className="text-sm text-slate-600">
              Отправка ответов и учёт баллов доступны студентам, записанным на курс.
            </p>
          )}
          <div className="mt-2 space-y-3">
            {exercises.map((ex) => (
              <div key={ex.id} className="rounded border border-slate-200 p-3">
                <p className="font-medium">{ex.title}</p>
                <p className="text-sm text-slate-600">{ex.payload?.question ?? 'Вопрос не указан'}</p>
                <div className="mt-2 flex gap-2">
                  <input
                    value={answers[ex.id] ?? ''}
                    onChange={(e) => setAnswers((x) => ({ ...x, [ex.id]: e.target.value }))}
                    disabled={!canActOnCourse || loadingEnrollment}
                    className="w-full rounded border border-slate-300 px-3 py-2 disabled:bg-slate-50"
                    placeholder="Ваш ответ"
                  />
                  <button
                    type="button"
                    disabled={loadingEnrollment || !canActOnCourse}
                    onClick={async () => {
                      setActionError('');
                      try {
                        const res = await submitExercise(ex.id, answers[ex.id] ?? '');
                        setExerciseResults((prev) => ({
                          ...prev,
                          [ex.id]: { correct: res.correct, score: res.score },
                        }));
                        setProgress(res.progress);
                      } catch (err) {
                        setActionError(getApiError(err));
                      }
                    }}
                    className="rounded border border-slate-300 px-3 py-2 disabled:opacity-50"
                  >
                    Отправить
                  </button>
                </div>
                {exerciseResults[ex.id] != null && (
                  <p className="mt-2 text-sm text-slate-700">
                    {exerciseResults[ex.id].correct ? 'Верно' : 'Неверно'} — начислено баллов:{' '}
                    {exerciseResults[ex.id].score}
                  </p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
