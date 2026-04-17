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
import { PageShell, SectionCard } from '../../components/layout';
import { useAppSelector } from '../../store/hooks';
import type { CourseDetail } from '../../types/domain';

export default function CourseDetailPage() {
  const { courseId = '' } = useParams();
  const user = useAppSelector((s) => s.app.user);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getCourseById(courseId)
      .then(setCourse)
      .catch((err) => setError(getApiError(err)));
  }, [courseId]);

  const isStudent = user?.roles.includes('STUDENT');

  return (
    <PageShell title={course?.title ?? 'Курс'} description={course?.description ?? 'Загрузка...'}>
      <div className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <SectionCard title="О курсе">
          <p className="mt-2 text-sm">
            {course?.language} • {course?.level} • рейтинг {course?.ratingAverage ?? 'n/a'}
          </p>
          {isStudent && (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => enrollToCourse(courseId)}
                className="rounded border border-slate-300 px-3 py-2"
              >
                Записаться
              </button>
              <button
                type="button"
                onClick={() => unenrollFromCourse(courseId)}
                className="rounded border border-slate-300 px-3 py-2"
              >
                Отписаться
              </button>
              <button
                type="button"
                onClick={() => addFavorite(courseId)}
                className="rounded border border-slate-300 px-3 py-2"
              >
                В избранное
              </button>
              <button
                type="button"
                onClick={() => removeFavorite(courseId)}
                className="rounded border border-slate-300 px-3 py-2"
              >
                Убрать из избранного
              </button>
            </div>
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
