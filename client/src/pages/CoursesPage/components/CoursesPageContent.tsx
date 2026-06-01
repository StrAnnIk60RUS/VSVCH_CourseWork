import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getApiError, getCourses } from '../../../api';
import {
  COURSE_LANGUAGES,
  COURSE_LEVEL_OPTIONS,
  formatCourseLanguage,
  normalizeCourseLanguageCode,
} from '../../../constants/courseOptions';
import { NavigationUp, PageShell, SectionCard } from '../../../components/layout';
import { useI18n } from '../../../hooks/useI18n';
import { STORAGE_KEYS } from '../../../constants/storage';
import type { CourseListItem } from '../../../types/domain';

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

export function CoursesPageContent() {
  const t = useI18n();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<CatalogFilters>(() => {
    if (searchParams.toString()) {
      return {
        language: normalizeCourseLanguageCode(searchParams.get('language') ?? ''),
        level: searchParams.get('level') ?? '',
        search: searchParams.get('search') ?? '',
        minRating: searchParams.get('minRating') ?? '',
      };
    }
    const raw = localStorage.getItem(STORAGE_KEYS.catalogFilters);
    if (raw) {
      const saved = JSON.parse(raw) as CatalogFilters;
      return { ...defaultFilters, ...saved, language: normalizeCourseLanguageCode(saved.language) };
    }
    return defaultFilters;
  });
  const [sort, setSort] = useState(() => {
    const sortParam = searchParams.get('sort');
    const orderParam = searchParams.get('order');
    if (sortParam || orderParam) {
      return `${sortParam ?? 'createdAt'}:${orderParam ?? 'desc'}`;
    }
    return localStorage.getItem(STORAGE_KEYS.catalogSort) ?? 'createdAt:desc';
  });
  const [page, setPage] = useState(() => {
    const pageFromQuery = Number(searchParams.get('page') ?? NaN);
    if (Number.isFinite(pageFromQuery) && pageFromQuery > 0) {
      return pageFromQuery;
    }
    return Number(localStorage.getItem(STORAGE_KEYS.catalogPage) ?? 1);
  });
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
    <PageShell title={t.courses.pageTitle} description={t.courses.pageDescription}>
      <div className="courses-page__stack">
        <NavigationUp links={[{ to: '/', label: t.progress.homeLink }]} />
        <SectionCard title={t.courses.filters}>
          <div className="mt-3 grid gap-2 md:grid-cols-4">
            <input
              value={filters.search}
              onChange={(e) => setFilters((x) => ({ ...x, search: e.target.value }))}
              placeholder={t.courses.searchPlaceholder}
              className="ui-input rounded px-3 py-2"
            />
            <select
              value={filters.language}
              onChange={(e) => setFilters((x) => ({ ...x, language: e.target.value }))}
              className="ui-input rounded px-3 py-2"
            >
              <option value="">{t.courses.languagePlaceholder}</option>
              {COURSE_LANGUAGES.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={filters.level}
              onChange={(e) => setFilters((x) => ({ ...x, level: e.target.value }))}
              className="ui-input rounded px-3 py-2"
            >
              <option value="">{t.courses.levelPlaceholder}</option>
              {COURSE_LEVEL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              value={filters.minRating}
              onChange={(e) => setFilters((x) => ({ ...x, minRating: e.target.value }))}
              placeholder={t.courses.minRatingPlaceholder}
              className="ui-input rounded px-3 py-2"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="ui-input rounded px-3 py-2"
            >
              <option value="createdAt:desc">{t.courses.sortNew}</option>
              <option value="rating:desc">{t.courses.sortRating}</option>
              <option value="popularity:desc">{t.courses.sortPopularity}</option>
              <option value="createdAt:asc">{t.courses.sortOld}</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setFilters(defaultFilters);
                setSort('createdAt:desc');
                setPage(1);
              }}
              className="ui-button-secondary rounded px-3 py-2"
            >
              {t.courses.reset}
            </button>
          </div>
        </SectionCard>
        <SectionCard title={`${t.courses.coursesLabel} (${total})`}>
          {error && <p className="text-ui-danger">{error}</p>}
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <article
                key={item.id}
                className="ui-card-interactive rounded border border-ui-border bg-ui-surface p-4"
              >
                <h3 className="font-semibold text-ui-text">{item.title}</h3>
                <p className="text-sm text-ui-muted">{item.description}</p>
                <p className="mt-2 text-xs text-ui-muted">
                  {formatCourseLanguage(item.language)} • {item.level} • {t.courses.lessonsLabel}: {item.lessonCount} •{' '}
                  {t.courses.sortRating}: {item.ratingAverage ?? t.courseDetail.na} ({item.reviewCount})
                </p>
                <Link
                  to={`/courses/${item.id}`}
                  className="ui-link-anim mt-3 inline-block text-sm text-ui-link"
                >
                  {t.courses.openCourse}
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((x) => Math.max(1, x - 1))}
              className="ui-button-secondary rounded px-3 py-2 disabled:opacity-50"
            >
              {t.courses.back}
            </button>
            <span className="text-sm text-ui-muted">
              {t.courses.page} {page}
            </span>
            <button
              type="button"
              disabled={items.length < 8}
              onClick={() => setPage((x) => x + 1)}
              className="ui-button-secondary rounded px-3 py-2 disabled:opacity-50"
            >
              {t.courses.next}
            </button>
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
