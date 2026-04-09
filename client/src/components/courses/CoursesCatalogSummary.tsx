export function CoursesCatalogSummary() {
  return (
    <aside
      aria-labelledby="courses-summary-heading"
      className="h-fit rounded-2xl border border-slate-200 bg-gradient-to-b from-brand-50/80 to-white p-5 shadow-sm lg:sticky lg:top-24"
    >
      <h2 id="courses-summary-heading" className="text-base font-semibold text-slate-900">
        Сводка
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Здесь будет число найденных курсов и активные фильтры после подключения данных.
      </p>
      <dl className="mt-4 space-y-3 rounded-xl border border-slate-200/80 bg-white/60 p-4 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500">Найдено</dt>
          <dd className="font-medium text-slate-900">—</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500">Страница</dt>
          <dd className="font-medium text-slate-900">—</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500">Сортировка</dt>
          <dd className="font-medium text-slate-900">—</dd>
        </div>
      </dl>
    </aside>
  );
}
