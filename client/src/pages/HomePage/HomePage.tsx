import { Link } from 'react-router-dom';
import { SectionCard } from '../../components/layout';

const benefits = [
  {
    title: 'Structured learning',
    body: 'Follow clear paths from first lesson to completion with progress you can trust.',
  },
  {
    title: 'For students and teachers',
    body: 'Study at your pace or publish courses with tools built for both roles.',
  },
  {
    title: 'Stay on track',
    body: 'Favorites, reminders, and progress views help you finish what you start.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-lg font-semibold text-slate-900">VSVH</span>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
            <Link className="text-slate-600 transition hover:text-brand-600" to="/courses">
              Courses
            </Link>
            <Link className="text-slate-600 transition hover:text-brand-600" to="/login">
              Log in
            </Link>
            <Link
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-white transition hover:bg-brand-700"
              to="/register"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-200 bg-gradient-to-br from-brand-50 via-white to-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Learn and teach in one place
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Landing overview for guests, students and teachers. Browse the catalog, open your account,
                and pick up where you left off.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                  to="/courses"
                >
                  Browse courses
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  to="/register"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-3">
            {benefits.map((item) => (
              <SectionCard key={item.title} title={item.title}>
                <p>{item.body}</p>
              </SectionCard>
            ))}
          </div>

          <section className="mt-12 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm lg:mt-16">
            <h2 className="text-xl font-semibold text-slate-900">How it works</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-slate-600">
              <li>Explore the course catalog and save favorites.</li>
              <li>Enroll and follow lessons in order with clear progress.</li>
              <li>Teachers create courses, add lessons, and track engagement.</li>
            </ol>
          </section>

          <aside className="mt-8 rounded-xl border border-brand-100 bg-brand-50/80 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Highlights</h2>
            <p className="mt-2 text-sm text-slate-600">
              Featured updates and announcements will appear here. For now, head to the catalog or sign in to
              see your learning space.
            </p>
          </aside>

          <footer className="mt-12 border-t border-slate-200 pt-8">
            <h2 className="text-lg font-semibold text-slate-900">Next steps</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Start browsing courses or open your account area to continue learning.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link className="text-sm font-medium text-brand-600 hover:text-brand-700" to="/courses">
                Go to courses →
              </Link>
              <Link className="text-sm font-medium text-brand-600 hover:text-brand-700" to="/login">
                Log in →
              </Link>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
