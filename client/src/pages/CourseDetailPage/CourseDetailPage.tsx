import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  addFavorite,
  enrollToCourse,
  getApiError,
  getCourseById,
  removeFavorite,
  unenrollFromCourse,
} from '../../api';
import { NavigationUp, PageShell, SectionCard } from '../../components/layout';
import { useAppSelector } from '../../store/hooks';
import type { CourseDetail } from '../../types/domain';

export default function CourseDetailPage() {
  const { courseId = '' } = useParams();
  const user = useAppSelector((s) => s.app.user);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError('');
    setActionMessage('');
    setCourse(null);
    getCourseById(courseId)
      .then((data) => {
        if (active) {
          setCourse(data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(getApiError(err));
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [courseId]);

  const isStudent = user?.roles.includes('STUDENT');

  async function runStudentAction(action: () => Promise<void>, successMessage: string) {
    setIsBusy(true);
    setError('');
    try {
      await action();
      setActionMessage(successMessage);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <PageShell title={course?.title ?? 'Курс'} description={course?.description ?? 'Загрузка...'}>
      <div className="space-y-4">
        <NavigationUp
          links={[
            { to: '/courses', label: 'Все курсы' },
            { to: '/', label: 'На главную' },
          ]}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <SectionCard title="О курсе">
          {isLoading && <p className="mt-2 text-sm text-slate-600">Загрузка данных курса...</p>}
          {!isLoading && !error && !course && <p className="mt-2 text-sm text-slate-600">Курс не найден.</p>}
          {!isLoading && course && (
            <p className="mt-2 text-sm">
              {course.language} • {course.level} • рейтинг {course.ratingAverage ?? 'n/a'}
            </p>
          )}
          {isStudent && (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={isBusy || isLoading || !course}
                onClick={() => runStudentAction(() => enrollToCourse(courseId), 'Вы записаны на курс')}
                className="rounded border border-slate-300 px-3 py-2 disabled:opacity-60"
              >
                Записаться
              </button>
              <button
                type="button"
                disabled={isBusy || isLoading || !course}
                onClick={() => runStudentAction(() => unenrollFromCourse(courseId), 'Запись на курс удалена')}
                className="rounded border border-slate-300 px-3 py-2 disabled:opacity-60"
              >
                Отписаться
              </button>
              <button
                type="button"
                disabled={isBusy || isLoading || !course}
                onClick={() => runStudentAction(() => addFavorite(courseId), 'Курс добавлен в избранное')}
                className="rounded border border-slate-300 px-3 py-2 disabled:opacity-60"
              >
                В избранное
              </button>
              <button
                type="button"
                disabled={isBusy || isLoading || !course}
                onClick={() => runStudentAction(() => removeFavorite(courseId), 'Курс удален из избранного')}
                className="rounded border border-slate-300 px-3 py-2 disabled:opacity-60"
              >
                Убрать из избранного
              </button>
            </div>
          )}
          {actionMessage && !error && (
            <p className="mt-2 text-sm text-emerald-700">{actionMessage}</p>
          )}
        </SectionCard>
        <SectionCard title="Уроки">
          <ul className="mt-2 space-y-2">
            {course?.lessons.map((lesson) => (
              <li key={lesson.id} className="rounded border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span>
                    {lesson.order}. {lesson.title}
                  </span>
                  <Link to={`/courses/${courseId}/lessons/${lesson.id}`} className="text-brand-700">
                    Открыть
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </PageShell>
  );
}
