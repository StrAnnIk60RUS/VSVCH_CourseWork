import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiError, getCourses } from '../../../api';
import { SectionCard } from '../../../components/layout';
import { useAuthSession } from '../../../hooks/useAuthSession';
import { useI18n } from '../../../hooks/useI18n';
import type { CourseListItem } from '../../../types/domain';

export function HomePageContent() {
  const t = useI18n();
  const { user, authChecked } = useAuthSession();
  const isTeacher = Boolean(user?.roles.includes('TEACHER'));
  const [featuredCourses, setFeaturedCourses] = useState<CourseListItem[]>([]);
  const [featuredError, setFeaturedError] = useState('');

  const rolePrimaryAction = useMemo(() => {
    if (!user) {
      return { to: '/register', label: t.home.createAccount };
    }
    if (user.roles.includes('TEACHER')) {
      return { to: '/teacher/courses/new', label: t.home.teacherCreateCourse };
    }
    if (user.roles.includes('STUDENT')) {
      return { to: '/me/learning', label: t.home.goToMyLearning };
    }
    return { to: '/me/profile', label: t.home.goToProfile };
  }, [t, user]);

  const roleNextStep = useMemo(() => {
    if (!user) {
      return { to: '/login', label: t.home.logIn };
    }
    if (user.roles.includes('TEACHER')) {
      return { to: '/teacher/analytics', label: t.home.teacherAnalytics };
    }
    if (user.roles.includes('STUDENT')) {
      return { to: '/me/learning', label: t.home.goToMyLearning };
    }
    return { to: '/me/profile', label: t.home.goToProfile };
  }, [t, user]);

  useEffect(() => {
    if (isTeacher) {
      return;
    }
    let active = true;
    getCourses({ page: 1, limit: 4, sort: 'popularity', order: 'desc' })
      .then((res) => {
        if (!active) {
          return;
        }
        setFeaturedCourses(res.items);
      })
      .catch((err) => {
        if (active) {
          setFeaturedError(getApiError(err));
        }
      });
    return () => {
      active = false;
    };
  }, [isTeacher]);

  const visibleFeaturedCourses = isTeacher ? [] : featuredCourses;
  const visibleFeaturedError = isTeacher ? '' : featuredError;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-ui-bg">
      <main className="flex-1">
        <section className="border-b border-ui-border bg-gradient-to-br from-ui-subtle via-ui-surface to-ui-bg">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold tracking-tight text-ui-text sm:text-5xl">{t.home.heroTitle}</h1>
              <p className="mt-4 text-lg text-ui-muted">{t.home.heroBody}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="ui-btn-primary px-5 py-2.5 text-sm font-semibold"
                  to={isTeacher ? '/teacher/courses' : '/courses'}
                >
                  {isTeacher ? t.home.goToTeacherCourses : t.home.browseCourses}
                </Link>
                <Link
                  className="ui-btn-secondary px-5 py-2.5 text-sm font-semibold"
                  to={authChecked ? rolePrimaryAction.to : '/register'}
                >
                  {authChecked ? rolePrimaryAction.label : t.home.createAccount}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-3">
            {t.home.benefits.map((item) => (
              <SectionCard key={item.title} title={item.title}>
                <p>{item.body}</p>
              </SectionCard>
            ))}
          </div>

          <section className="mt-12 rounded-2xl border border-ui-border bg-ui-surface p-8 shadow-sm lg:mt-16">
            <h2 className="text-xl font-semibold text-ui-text">{t.home.howItWorks}</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-ui-muted">
              {t.home.howSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          {isTeacher ? (
            <section className="mt-8 rounded-2xl border border-ui-border bg-ui-surface p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-ui-text">{t.home.teacherHubTitle}</h2>
                <Link className="ui-link-anim text-sm font-medium text-ui-link" to="/teacher/courses">
                  {`${t.home.goToTeacherCourses} ->`}
                </Link>
              </div>
              <p className="mt-2 text-sm text-ui-muted">{t.home.teacherHubBody}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Link className="rounded-lg border border-ui-border bg-ui-bg p-4 text-sm text-ui-text" to="/teacher/courses">
                  <p className="font-medium">{t.home.teacherManageCourses}</p>
                  <p className="mt-1 text-ui-muted">{t.home.teacherManageCoursesBody}</p>
                </Link>
                <Link
                  className="rounded-lg border border-ui-border bg-ui-bg p-4 text-sm text-ui-text"
                  to="/teacher/courses/new"
                >
                  <p className="font-medium">{t.home.teacherCreateCourse}</p>
                  <p className="mt-1 text-ui-muted">{t.home.teacherCreateCourseBody}</p>
                </Link>
                <Link
                  className="rounded-lg border border-ui-border bg-ui-bg p-4 text-sm text-ui-text"
                  to="/teacher/analytics"
                >
                  <p className="font-medium">{t.home.teacherAnalytics}</p>
                  <p className="mt-1 text-ui-muted">{t.home.teacherAnalyticsBody}</p>
                </Link>
              </div>
            </section>
          ) : (
            <section className="mt-8 rounded-2xl border border-ui-border bg-ui-surface p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-ui-text">{t.home.discoveryTitle}</h2>
                <Link className="ui-link-anim text-sm font-medium text-ui-link" to="/courses">
                  {`${t.home.goToCourses} ->`}
                </Link>
              </div>
              <p className="mt-2 text-sm text-ui-muted">{t.home.discoveryBody}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link className="ui-btn-secondary text-sm" to="/courses?sort=popularity&order=desc">
                  {t.home.quickPopular}
                </Link>
                <Link className="ui-btn-secondary text-sm" to="/courses?sort=createdAt&order=desc">
                  {t.home.quickNewest}
                </Link>
                <Link className="ui-btn-secondary text-sm" to="/courses?language=en">
                  {t.home.quickEnglish}
                </Link>
                <Link className="ui-btn-secondary text-sm" to="/courses?level=beginner">
                  {t.home.quickBeginner}
                </Link>
              </div>
              {visibleFeaturedError && <p className="mt-4 text-sm text-ui-danger">{visibleFeaturedError}</p>}
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {visibleFeaturedCourses.map((item) => (
                  <article key={item.id} className="rounded-lg border border-ui-border bg-ui-bg p-4">
                    <h3 className="font-medium text-ui-text">{item.title}</h3>
                    <p className="mt-1 text-sm text-ui-muted">{item.description}</p>
                    <p className="mt-2 text-xs text-ui-muted">
                      {item.language} • {item.level} • {t.home.lessonsLabel}: {item.lessonCount}
                    </p>
                    <Link className="ui-link-anim mt-3 inline-block text-sm text-ui-link" to={`/courses/${item.id}`}>
                      {t.home.openCourse}
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="mt-12 border-t border-ui-border pt-8" aria-labelledby="home-next-steps-heading">
            <h2 id="home-next-steps-heading" className="text-lg font-semibold text-ui-text">
              {t.home.nextSteps}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-ui-muted">{t.home.nextStepsBody}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {isTeacher ? (
                <>
                  <Link className="ui-link-anim text-sm font-medium text-ui-link" to="/teacher/courses">
                    {`${t.home.goToTeacherCourses} ->`}
                  </Link>
                  <Link className="ui-link-anim text-sm font-medium text-ui-link" to="/teacher/courses/new">
                    {`${t.home.teacherCreateCourse} ->`}
                  </Link>
                </>
              ) : (
                <Link className="ui-link-anim text-sm font-medium text-ui-link" to="/courses">
                  {`${t.home.goToCourses} ->`}
                </Link>
              )}
              {isTeacher ? null : (
                <Link className="ui-link-anim text-sm font-medium text-ui-link" to={roleNextStep.to}>
                  {`${roleNextStep.label} ->`}
                </Link>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
