import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteCourse, getApiError, getTeacherCourses } from '../../../api';
import { formatCourseLanguage } from '../../../constants/courseOptions';
import { NavigationUp, PageShell, SectionCard } from '../../../components/layout';
import { useI18n } from '../../../hooks/useI18n';
import { useToast } from '../../../hooks/useToast';

export function TeacherCoursesPageContent() {
  const t = useI18n();
  const { showSuccess, showError } = useToast();
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
  const [busyCourseId, setBusyCourseId] = useState<string | null>(null);

  useEffect(() => {
    getTeacherCourses()
      .then((res) => setItems(res.items))
      .catch((err) => setError(getApiError(err)));
  }, []);

  async function handleDeleteCourse(courseId: string, title: string) {
    const confirmed = window.confirm(t.teacherCourses.deleteConfirm.replace('{title}', title));
    if (!confirmed) {
      return;
    }
    setBusyCourseId(courseId);
    setError('');
    try {
      await deleteCourse(courseId);
      setItems((prev) => prev.filter((item) => item.id !== courseId));
      showSuccess(t.teacherCourses.deleted);
    } catch (err) {
      const message = getApiError(err);
      setError(message);
      showError(message);
    } finally {
      setBusyCourseId(null);
    }
  }

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
                    {formatCourseLanguage(item.language)} • {item.level} • {t.teacherCourses.lessons}{' '}
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
                  <button
                    type="button"
                    onClick={() => {
                      void handleDeleteCourse(item.id, item.title);
                    }}
                    className="ui-btn-danger text-sm"
                    disabled={busyCourseId === item.id}
                  >
                    {busyCourseId === item.id ? t.teacherCourses.deleting : t.teacherCourses.delete}
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
