import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiError, getCourses } from '../../api';
import { PageShell, SectionCard } from '../../components/layout';
import { STORAGE_KEYS } from '../../constants/storage';
import type { CourseListItem } from '../../types/domain';

interface CatalogFilters {
  language: string;
  level: string;
  search: string;
  minRating: string;
}

const defaultFilters: CatalogFilters = {
  language: '',
  level: '',
  search: '',
  minRating: '',
};

export default function CoursesPage() {
  const [filters, setFilters] = useState<CatalogFilters>(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.catalogFilters);
    return raw ? ({ ...defaultFilters, ...JSON.parse(raw) } as CatalogFilters) : defaultFilters;
  });
  const [sort, setSort] = useState(() => localStorage.getItem(STORAGE_KEYS.catalogSort) ?? 'createdAt:desc');
  const [page, setPage] = useState(() => Number(localStorage.getItem(STORAGE_KEYS.catalogPage) ?? 1));
  const [items, setItems] = useState<CourseListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  const sortParts = useMemo(() => {
    const [field, order] = sort.split(':');
    return {
      sort: field ?? 'createdAt',
      order: order ?? 'desc',
    };
  }, [sort]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.catalogFilters, JSON.stringify(filters));
    localStorage.setItem(STORAGE_KEYS.catalogSort, sort);
    localStorage.setItem(STORAGE_KEYS.catalogPage, String(page));
  }, [filters, sort, page]);

  useEffect(() => {
    let active = true;
    getCourses({
      ...filters,
      page,
      limit: 8,
      sort: sortParts.sort,
      order: sortParts.order,
    })
      .then((res) => {
        if (!active) {
          return;
        }
        setItems(res.items);
        setTotal(res.total);
      })
      .catch((err) => {
        if (active) {
          setError(getApiError(err));
        }
      });
    return () => {
      active = false;
    };
  }, [filters, page, sortParts.order, sortParts.sort]);

  return (
    <PageShell title="Каталог курсов" description="Публичный каталог с фильтрами, сортировкой и пагинацией.">
      <div className="space-y-4">
        <SectionCard title="Фильтры">
          <div className="mt-3 grid gap-2 md:grid-cols-4">
            <input
              value={filters.search}
              onChange={(e) => setFilters((x) => ({ ...x, search: e.target.value }))}
              placeholder="Поиск"
              className="rounded border border-slate-300 px-3 py-2"
            />
            <input
              value={filters.language}
              onChange={(e) => setFilters((x) => ({ ...x, language: e.target.value }))}
              placeholder="Язык"
              className="rounded border border-slate-300 px-3 py-2"
            />
            <input
              value={filters.level}
              onChange={(e) => setFilters((x) => ({ ...x, level: e.target.value }))}
              placeholder="Уровень"
              className="rounded border border-slate-300 px-3 py-2"
            />
            <input
              value={filters.minRating}
              onChange={(e) => setFilters((x) => ({ ...x, minRating: e.target.value }))}
              placeholder="Мин. рейтинг"
              className="rounded border border-slate-300 px-3 py-2"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded border border-slate-300 px-3 py-2"
            >
              <option value="createdAt:desc">Новые</option>
              <option value="rating:desc">Рейтинг</option>
              <option value="popularity:desc">Популярность</option>
              <option value="createdAt:asc">Старые</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setFilters(defaultFilters);
                setSort('createdAt:desc');
                setPage(1);
              }}
              className="rounded border border-slate-300 px-3 py-2"
            >
              Сброс
            </button>
          </div>
        </SectionCard>
        <SectionCard title={`Курсы (${total})`}>
          {error && <p className="text-red-600">{error}</p>}
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <article key={item.id} className="rounded border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {item.language} • {item.level} • уроков: {item.lessonCount}
                </p>
                <Link to={`/courses/${item.id}`} className="mt-3 inline-block text-sm text-brand-700">
                  Открыть курс
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((x) => Math.max(1, x - 1))}
              className="rounded border border-slate-300 px-3 py-2 disabled:opacity-50"
            >
              Назад
            </button>
            <span className="text-sm text-slate-600">Страница {page}</span>
            <button
              type="button"
              disabled={items.length < 8}
              onClick={() => setPage((x) => x + 1)}
              className="rounded border border-slate-300 px-3 py-2 disabled:opacity-50"
            >
              Далее
            </button>
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
