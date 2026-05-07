import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiError, getTeacherCourses } from '../../api';
import { COURSE_LANGUAGE_OPTIONS } from '../../constants/courseOptions';
import { NavigationUp, PageShell, SectionCard } from '../../components/layout';
import { useI18n } from '../../hooks/useI18n';

const LANGUAGE_LABELS: Record<string, (typeof COURSE_LANGUAGE_OPTIONS)[number]> = {
  en: 'English',
  es: 'Spanish',
  de: 'German',
  fr: 'French',
  uk: 'Ukrainian',
  pl: 'Polish',
};

function formatLanguage(language: string) {
  return LANGUAGE_LABELS[language] ?? language;
}

export default function TeacherCoursesPage() {
  const t = useI18n();
  const [items, setItems] = useState<
    Array<{
      id: string;
      title: string;
      language: string;
      level: string;
      published: boolean;
      ratingAverage: number | null;
      lessonCount: number;
      enrollmentCount: number;
      reviewCount: number;
    }>
  >([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getTeacherCourses()
      .then((res) => setItems(res.items))
      .catch((err) => setError(getApiError(err)));
  }, []);

  return (
    <PageShell title={t.teacherCourses.pageTitle} description={t.teacherCourses.pageDescription}>
      <NavigationUp links={[{ to: '/', label: t.teacherCourses.home }]} />
      <SectionCard title={t.teacherCourses.listTitle}>
        <Link to="/teacher/courses/new" className="ui-btn-primary inline-flex">
          {t.teacherCourses.createCourse}
        </Link>
        {error && <p className="mt-2 text-sm text-ui-danger">{error}</p>}
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="ui-card-interactive rounded border border-ui-border bg-ui-surface p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-ui-text">{item.title}</p>
                  <p className="text-sm text-ui-muted">
                    {formatLanguage(item.language)} • {item.level} • {t.teacherCourses.lessons}{' '}
                    {item.lessonCount} • {t.teacherCourses.students} {item.enrollmentCount} •{' '}
                    {t.teacherCourses.rating}{' '}
                    {item.reviewCount > 0 && item.ratingAverage != null
                      ? item.ratingAverage.toFixed(1)
                      : t.teacherCourses.notAvailable}{' '}
                    •{' '}
                    {t.teacherCourses.reviews} {item.reviewCount}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.published ? (
                    <Link to={`/courses/${item.id}/reviews`} className="ui-btn-secondary text-sm">
                      {t.teacherCourses.openReviews}
                    </Link>
                  ) : null}
                  <Link to={`/teacher/courses/${item.id}`} className="ui-btn-secondary text-sm">
                    {t.teacherCourses.manage}
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </PageShell>
  );
}
