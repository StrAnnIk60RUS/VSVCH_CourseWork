import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getApiError, getCourseById, getCourseReviews } from '../../api';
import { NavigationUp, PageShell, SectionCard } from '../../components/layout';
import { useI18n } from '../../hooks/useI18n';
import type { CourseReviewPublicItem } from '../../api/coursesApi';

export default function CourseReviewsPage() {
  const t = useI18n();
  const { courseId = '' } = useParams();
  const [courseTitle, setCourseTitle] = useState(t.courseReviews.pageDescriptionFallback);
  const [items, setItems] = useState<CourseReviewPublicItem[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(courseId));
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([getCourseById(courseId), getCourseReviews(courseId)])
      .then(([course, reviews]) => {
        if (!active) return;
        setCourseTitle(course.title);
        setItems(reviews.items);
        setError('');
      })
      .catch((err) => {
        if (!active) return;
        setError(getApiError(err));
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

  return (
    <PageShell title={t.courseReviews.pageTitle} description={courseTitle}>
      <div className="space-y-4">
        <NavigationUp
          links={[
            { to: `/courses/${courseId}`, label: t.courseReviews.toCourse },
            { to: '/courses', label: t.courseReviews.allCourses },
          ]}
        />

        <SectionCard title={`${t.courseReviews.sectionTitle} (${items.length})`}>
          {isLoading && <p className="text-sm text-ui-muted">{t.courseReviews.loading}</p>}
          {!isLoading && error && <p className="text-sm text-ui-danger">{error}</p>}
          {!isLoading && !error && items.length === 0 && (
            <p className="text-sm text-ui-muted">{t.courseReviews.empty}</p>
          )}
          {!isLoading && !error && items.length > 0 && (
            <ul className="mt-2 space-y-3">
              {items.map((item, idx) => (
                <li key={`${item.author?.id ?? 'anon'}-${item.createdAt}-${idx}`}>
                  <article className="rounded border border-ui-border bg-ui-surface p-3">
                    <p className="text-sm font-medium text-ui-text">
                      {item.author?.name ?? t.courseReviews.userFallback} • {t.courseReviews.rating}: {item.rating}/5
                    </p>
                    <p className="mt-1 text-sm text-ui-muted">
                      {item.comment?.trim() ? item.comment : t.courseReviews.noComment}
                    </p>
                    <p className="mt-2 text-xs text-ui-muted">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          )}
          <Link to={`/courses/${courseId}`} className="ui-link-anim mt-4 inline-block text-sm text-ui-link">
            {t.courseReviews.backToCourse}
          </Link>
        </SectionCard>
      </div>
    </PageShell>
  );
}
