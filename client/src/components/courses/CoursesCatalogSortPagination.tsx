export function CoursesCatalogSortPagination() {
  return (
    <section
      aria-labelledby="courses-sort-pagination-heading"
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 id="courses-sort-pagination-heading" className="sr-only">
          Сортировка и страницы
        </h2>
        <p className="text-sm font-medium text-slate-900">Сортировка</p>
        <div
          className="mt-2 h-9 max-w-xs rounded-lg border border-dashed border-slate-200 bg-slate-50/80"
          aria-hidden
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600">Страница</span>
        <div className="flex gap-1" aria-hidden>
          <span className="h-9 w-9 rounded-lg border border-slate-200 bg-white" />
          <span className="h-9 w-9 rounded-lg border border-slate-200 bg-white" />
          <span className="h-9 w-9 rounded-lg border border-slate-200 bg-white" />
        </div>
      </div>
    </section>
  );
}
