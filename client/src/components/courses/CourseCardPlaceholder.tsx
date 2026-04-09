type CourseCardPlaceholderProps = {
  /** Static label for layout scaffolding only. */
  label: string;
};

export function CourseCardPlaceholder({ label }: CourseCardPlaceholderProps) {
  return (
    <article
      aria-label={label}
      className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <header className="border-b border-slate-100 pb-4">
        <div className="h-2 w-12 rounded-full bg-brand-500/80" aria-hidden />
        <h3 className="mt-3 text-lg font-semibold text-slate-900">Название курса</h3>
        <p className="mt-1 text-sm text-slate-600">Преподаватель</p>
      </header>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
        Краткое описание курса — здесь будет текст из API.
      </p>
      <footer className="mt-6 space-y-3 border-t border-slate-100 pt-4">
        <p className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-md bg-slate-100 px-2 py-0.5">Язык</span>
          <span className="rounded-md bg-slate-100 px-2 py-0.5">Уровень</span>
          <span className="rounded-md bg-slate-100 px-2 py-0.5">Рейтинг</span>
          <span className="rounded-md bg-slate-100 px-2 py-0.5">Записей</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex h-9 flex-1 min-w-[6rem] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
            Подробнее
          </span>
          <span className="inline-flex h-9 flex-1 min-w-[6rem] items-center justify-center rounded-lg bg-brand-600 text-xs font-medium text-white">
            Записаться
          </span>
        </div>
      </footer>
    </article>
  );
}
