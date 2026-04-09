function FilterField({ id, label }: { id: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <div
        id={id}
        className="h-10 rounded-lg border border-dashed border-slate-200 bg-slate-50/80"
        aria-hidden
      />
    </div>
  );
}

export function CoursesCatalogFilters() {
  return (
    <section
      aria-labelledby="courses-filters-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 id="courses-filters-heading" className="text-lg font-semibold text-slate-900">
        Фильтры
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Язык, уровень, рейтинг и поиск по названию — поля появятся при подключении данных.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FilterField id="filter-lang" label="Язык" />
        <FilterField id="filter-level" label="Уровень" />
        <FilterField id="filter-rating" label="Рейтинг" />
        <FilterField id="filter-search" label="Поиск" />
      </div>
    </section>
  );
}
