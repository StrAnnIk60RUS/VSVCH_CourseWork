import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiError, getFavorites, removeFavorite } from '../../api';
import { PageShell, SectionCard } from '../../components/layout';

export default function FavoritesPage() {
  const [items, setItems] = useState<Array<{ courseId: string; course: { title: string; language: string; level: string } }>>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getFavorites()
      .then((res) => setItems(res.items))
      .catch((err) => setError(getApiError(err)));
  }, []);

  return (
    <PageShell title="Избранное" description="Сохраненные курсы и быстрые действия.">
      <SectionCard title="Список избранного">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.courseId} className="rounded border border-slate-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{item.course.title}</p>
                  <p className="text-sm text-slate-600">
                    {item.course.language} • {item.course.level}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/courses/${item.courseId}`} className="rounded border border-slate-300 px-2 py-1">
                    Открыть
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      await removeFavorite(item.courseId);
                      setItems((prev) => prev.filter((x) => x.courseId !== item.courseId));
                    }}
                    className="rounded border border-slate-300 px-2 py-1"
                  >
                    Удалить
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
