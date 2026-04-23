import { Link } from 'react-router-dom';
import { SectionCard } from '../../components/layout';
import { useI18n } from '../../hooks/useI18n';

export default function HomePage() {
  const t = useI18n();

  return (
    <div className="min-h-dvh bg-ui-bg">
      <header className="border-b border-ui-border bg-ui-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-lg font-semibold text-ui-text">{t.common.appName}</span>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
            <Link className="text-ui-muted transition hover:text-ui-link-hover" to="/courses">
              {t.nav.courses}
            </Link>
            <Link className="text-ui-muted transition hover:text-ui-link-hover" to="/login">
              {t.home.logIn}
            </Link>
            <Link
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-white transition hover:bg-brand-700"
              to="/register"
            >
              {t.nav.register}
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-ui-border bg-gradient-to-br from-brand-50 via-ui-surface to-ui-bg">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold tracking-tight text-ui-text sm:text-5xl">{t.home.heroTitle}</h1>
              <p className="mt-4 text-lg text-ui-muted">{t.home.heroBody}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                  to="/courses"
                >
                  {t.home.browseCourses}
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-lg border border-ui-border bg-ui-surface px-5 py-2.5 text-sm font-semibold text-ui-text shadow-sm transition hover:bg-ui-subtle"
                  to="/register"
                >
                  {t.home.createAccount}
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

          <aside className="mt-8 rounded-xl border border-ui-border bg-ui-surface p-6">
            <h2 className="text-lg font-semibold text-ui-text">{t.home.highlights}</h2>
            <p className="mt-2 text-sm text-ui-muted">{t.home.highlightsBody}</p>
          </aside>

          <footer className="mt-12 border-t border-ui-border pt-8">
            <h2 className="text-lg font-semibold text-ui-text">{t.home.nextSteps}</h2>
            <p className="mt-2 max-w-2xl text-sm text-ui-muted">{t.home.nextStepsBody}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link className="text-sm font-medium text-ui-link hover:text-ui-link-hover" to="/courses">
                {`${t.home.goToCourses} ->`}
              </Link>
              <Link className="text-sm font-medium text-ui-link hover:text-ui-link-hover" to="/login">
                {`${t.home.logIn} ->`}
              </Link>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
