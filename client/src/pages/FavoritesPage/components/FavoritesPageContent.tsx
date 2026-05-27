import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiError, getFavorites, removeFavorite } from '../../../api';
import { PageShell, SectionCard } from '../../../components/layout';
import { useI18n } from '../../../hooks/useI18n';

export function FavoritesPageContent() {
  const t = useI18n();
  const [items, setItems] = useState<Array<{ courseId: string; course: { title: string; language: string; level: string } }>>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getFavorites()
      .then((res) => setItems(res.items))
      .catch((err) => setError(getApiError(err)));
  }, []);

  return (
    <PageShell title={t.favorites.pageTitle} description={t.favorites.pageDescription}>
      <SectionCard title={t.favorites.sectionTitle}>
        {error && <p className="text-sm text-ui-danger">{error}</p>}
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li
              key={item.courseId}
              className="ui-card-interactive rounded border border-ui-border bg-ui-surface p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{item.course.title}</p>
                  <p className="text-sm text-ui-muted">
                    {item.course.language} • {item.course.level}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/courses/${item.courseId}`} className="ui-btn-secondary text-sm">
                    {t.favorites.open}
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      await removeFavorite(item.courseId);
                      setItems((prev) => prev.filter((x) => x.courseId !== item.courseId));
                    }}
                    className="ui-btn-danger text-sm"
                  >
                    {t.favorites.remove}
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
