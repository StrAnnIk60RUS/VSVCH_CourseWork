import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  addFavorite,
  enrollToCourse,
  getMyCourseReview,
  getApiError,
  getCourseById,
  getEnrollments,
  getFavorites,
  removeFavorite,
  unenrollFromCourse,
  upsertCourseReview,
} from '../../../api';
import { formatCourseLanguage } from '../../../constants/courseOptions';
import { NavigationUp, PageShell, SectionCard } from '../../../components/layout';
import { useAuthSession } from '../../../hooks/useAuthSession';
import { useI18n } from '../../../hooks/useI18n';
import { useToast } from '../../../hooks/useToast';
import type { CourseDetail } from '../../../types/domain';

const REVIEW_MIN_PROGRESS_PERCENT = 20;

function getCourseProgressPercent(course: CourseDetail | null): number {
  if (!course || course.lessons.length === 0) {
    return 0;
  }
  const total = course.lessons.reduce((sum, lesson) => sum + lesson.progressPercent, 0);
  return Math.round(total / course.lessons.length);
}

export function CourseDetailPageContent() {
  const t = useI18n();
  const { showSuccess, showError } = useToast();
  const { courseId = '' } = useParams();
  const { user } = useAuthSession();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isReviewBusy, setIsReviewBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);
  const [isEnrolledInCourse, setIsEnrolledInCourse] = useState<boolean | null>(null);
  const [myRating, setMyRating] = useState(5);
  const [myComment, setMyComment] = useState('');
  const [hasReviewLoaded, setHasReviewLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError('');
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
  const courseProgressPercent = getCourseProgressPercent(course);
  const canRateCourse = Boolean(
    isEnrolledInCourse && courseProgressPercent >= REVIEW_MIN_PROGRESS_PERCENT,
  );

  useEffect(() => {
    if (!isStudent) {
      setIsFavorite(null);
      return;
    }
    let active = true;
    setIsFavorite(null);
    getFavorites()
      .then((res) => {
        if (!active) return;
        setIsFavorite(res.items.some((item) => item.courseId === courseId));
      })
      .catch(() => {
        if (!active) return;
        setIsFavorite(false);
      });
    return () => {
      active = false;
    };
  }, [courseId, isStudent]);

  useEffect(() => {
    if (!isStudent) {
      setMyRating(5);
      setMyComment('');
      setHasReviewLoaded(true);
      return;
    }
    let active = true;
    setHasReviewLoaded(false);
    getMyCourseReview(courseId)
      .then((res) => {
        if (!active) return;
        if (res.myReview) {
          setMyRating(res.myReview.rating);
          setMyComment(res.myReview.comment ?? '');
        } else {
          setMyRating(5);
          setMyComment('');
        }
      })
      .catch(() => {
        if (!active) return;
        setMyRating(5);
        setMyComment('');
      })
      .finally(() => {
        if (active) {
          setHasReviewLoaded(true);
        }
      });

    return () => {
      active = false;
    };
  }, [courseId, isStudent]);

  useEffect(() => {
    if (!isStudent) {
      setIsEnrolledInCourse(null);
      return;
    }
    let active = true;
    setIsEnrolledInCourse(null);
    getEnrollments()
      .then((res) => {
        if (!active) return;
        setIsEnrolledInCourse(res.items.some((item) => item.courseId === courseId));
      })
      .catch(() => {
        if (!active) return;
        setIsEnrolledInCourse(false);
      });
    return () => {
      active = false;
    };
  }, [courseId, isStudent]);

  async function runStudentAction(action: () => Promise<void>, successMessage: string) {
    setIsBusy(true);
    setError('');
    try {
      await action();
      showSuccess(successMessage);
    } catch (err) {
      const message = getApiError(err);
      setError(message);
      showError(message);
    } finally {
      setIsBusy(false);
    }
  }

  async function saveReview() {
    if (!course) return;
    setIsReviewBusy(true);
    setError('');
    try {
      const result = await upsertCourseReview(courseId, {
        rating: myRating,
        comment: myComment,
      });
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              ratingAverage: result.ratingAverage,
              reviewCount: result.reviewCount,
            }
          : prev,
      );
      showSuccess(t.courseDetail.savedRating);
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 403) {
        const message = t.courseDetail.rateAfterProgress.replace(
          '{percent}',
          String(REVIEW_MIN_PROGRESS_PERCENT),
        );
        setError(message);
        showError(message);
      } else {
        const message = getApiError(err);
        setError(message);
        showError(message);
      }
    } finally {
      setIsReviewBusy(false);
    }
  }

  return (
    <PageShell title={course?.title ?? t.courseDetail.titleFallback} description={course?.description ?? t.courseDetail.loadingDescription}>
      <div className="course-detail-page__stack">
        <NavigationUp
          links={[
            { to: '/courses', label: t.courseDetail.allCourses },
            { to: '/', label: t.courseDetail.home },
          ]}
        />
        {error && <p className="text-sm text-ui-danger">{error}</p>}
        <SectionCard title={t.courseDetail.about}>
          {isLoading && <p className="mt-2 text-sm text-ui-muted">{t.courseDetail.loading}</p>}
          {!isLoading && !error && !course && <p className="mt-2 text-sm text-ui-muted">{t.courseDetail.notFound}</p>}
          {!isLoading && course && (
            <p className="mt-2 text-sm">
              {formatCourseLanguage(course.language)} • {course.level} • {t.courseDetail.ratingWord} {course.ratingAverage ?? t.courseDetail.na} (
              {course.reviewCount})
            </p>
          )}
          {isStudent && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={isBusy || isLoading || !course || isEnrolledInCourse === null}
                onClick={() =>
                  runStudentAction(
                    async () => {
                      if (isEnrolledInCourse) {
                        await unenrollFromCourse(courseId);
                        setIsEnrolledInCourse(false);
                        return;
                      }
                      await enrollToCourse(courseId);
                      setIsEnrolledInCourse(true);
                    },
                    isEnrolledInCourse ? t.courseDetail.unenrolled : t.courseDetail.enrolled,
                  )
                }
                className={isEnrolledInCourse ? 'ui-btn-danger' : 'ui-btn-primary'}
              >
                {isEnrolledInCourse === null
                  ? t.courseDetail.checkingEnrollment
                  : isEnrolledInCourse
                    ? t.courseDetail.unenroll
                    : t.courseDetail.enroll}
              </button>
              <button
                type="button"
                disabled={isBusy || isLoading || !course || isFavorite === null}
                onClick={() =>
                  runStudentAction(
                    async () => {
                      if (isFavorite) {
                        await removeFavorite(courseId);
                        setIsFavorite(false);
                        return;
                      }
                      await addFavorite(courseId);
                      setIsFavorite(true);
                    },
                    isFavorite ? t.courseDetail.removedFromFavorites : t.courseDetail.addedToFavorites,
                  )
                }
                className={isFavorite ? 'ui-btn-danger' : 'ui-btn-secondary'}
              >
                {isFavorite === null
                  ? t.courseDetail.checkingFavorites
                  : isFavorite
                    ? t.courseDetail.removeFavorite
                    : t.courseDetail.addFavorite}
              </button>
              <Link to={`/courses/${courseId}/reviews`} className="ui-btn-secondary inline-flex items-center">
                {t.courseDetail.reviews}
              </Link>
            </div>
          )}
          {!isStudent && (
            <div className="mt-3">
              <Link to={`/courses/${courseId}/reviews`} className="ui-btn-secondary inline-flex items-center">
                {t.courseDetail.reviews}
              </Link>
            </div>
          )}
        </SectionCard>
        {isStudent && (
          <SectionCard title={t.courseDetail.rateSection}>
            <div className="mt-2 space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block text-ui-muted">{t.courseDetail.yourRating}</span>
                <select
                  className="ui-input w-full rounded px-3 py-2"
                  value={myRating}
                  onChange={(e) => setMyRating(Number(e.target.value))}
                  disabled={!hasReviewLoaded || isReviewBusy || !canRateCourse}
                >
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-ui-muted">{t.courseDetail.optionalComment}</span>
                <textarea
                  className="ui-input min-h-[96px] w-full rounded px-3 py-2"
                  value={myComment}
                  onChange={(e) => setMyComment(e.target.value)}
                  maxLength={1000}
                  disabled={!hasReviewLoaded || isReviewBusy || !canRateCourse}
                />
              </label>
              <button
                type="button"
                className="ui-btn-primary"
                onClick={saveReview}
                disabled={
                  isLoading ||
                  isReviewBusy ||
                  !hasReviewLoaded ||
                  !course ||
                  !canRateCourse
                }
              >
                {isReviewBusy ? t.courseDetail.savePending : t.courseDetail.saveRating}
              </button>
              {isEnrolledInCourse === false && (
                <p className="text-sm text-ui-muted">
                  {t.courseDetail.rateAfterEnroll}
                </p>
              )}
              {isEnrolledInCourse && !canRateCourse && (
                <p className="text-sm text-ui-muted">
                  {t.courseDetail.rateAfterProgress.replace(
                    '{percent}',
                    String(REVIEW_MIN_PROGRESS_PERCENT),
                  )}
                </p>
              )}
            </div>
          </SectionCard>
        )}
        <SectionCard title={t.courseDetail.lessons}>
          <ul className="mt-2 space-y-2">
            {course?.lessons.map((lesson) => (
              <li
                key={lesson.id}
                className="ui-card-interactive rounded border border-ui-border bg-ui-surface p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span>
                      {lesson.order}. {lesson.title}
                    </span>
                    <p className="mt-1 text-xs text-ui-muted">
                      {t.courseDetail.lessonProgress}: <span className="font-medium text-ui-text">{lesson.progressPercent}%</span>
                    </p>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-ui-subtle">
                      <div
                        className="h-full rounded bg-ui-success transition-[width]"
                        style={{ width: `${lesson.progressPercent}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-ui-muted">
                    {lesson.progressPercent === 100 ? t.courseDetail.completed : t.courseDetail.inProgress}
                  </span>
                  <Link
                    to={`/courses/${courseId}/lessons/${lesson.id}`}
                    className="ui-link-anim shrink-0 text-ui-link"
                  >
                    {t.courseDetail.open}
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
