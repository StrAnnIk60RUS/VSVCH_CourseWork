import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiError, getEnrollments, unenrollFromCourse } from '../../api';
import { PageShell, SectionCard } from '../../components/layout';

export default function MyLearningPage() {
  const [items, setItems] = useState<Array<{ courseId: string; progress: number; course: { title: string } }>>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getEnrollments()
      .then((res) => setItems(res.items))
      .catch((err) => setError(getApiError(err)));
  }, []);

  return (
    <PageShell title="Мое обучение" description="Активные записи на курсы и текущий прогресс.">
      <SectionCard title="Записи на курсы">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.courseId} className="rounded border border-slate-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{item.course.title}</p>
                  <p className="text-sm text-slate-600">Прогресс: {item.progress}%</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/courses/${item.courseId}`} className="rounded border border-slate-300 px-2 py-1">
                    К курсу
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      await unenrollFromCourse(item.courseId);
                      setItems((prev) => prev.filter((x) => x.courseId !== item.courseId));
                    }}
                    className="rounded border border-slate-300 px-2 py-1"
                  >
                    Отписаться
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </PageShell>
  );
}
