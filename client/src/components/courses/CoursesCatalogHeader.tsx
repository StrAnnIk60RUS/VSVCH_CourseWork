import { Link } from 'react-router-dom';

export function CoursesCatalogHeader() {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="text-sm font-medium text-brand-600 transition hover:text-brand-700"
          >
            ← VSVH Languages
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm" aria-label="Account">
            <Link
              to="/login"
              className="rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Вход
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-brand-600 px-3 py-1.5 font-medium text-white shadow-sm transition hover:bg-brand-700"
            >
              Регистрация
            </Link>
          </nav>
        </div>
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wide text-brand-600">Каталог</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Курсы
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Выбирайте язык и уровень — структура каталога заточена под быстрый поиск и запись на
            обучение.
          </p>
        </div>
      </div>
    </header>
  );
}
