const NAV_CHIPS = ['Все курсы', 'Популярное', 'Новинки', 'Для начинающих'];

export function CoursesCatalogNav() {
  return (
    <nav aria-label="Разделы каталога" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="sr-only">Навигация по каталогу</h2>
      <ul className="flex flex-wrap gap-2">
        {NAV_CHIPS.map((label) => (
          <li key={label}>
            <span className="inline-flex cursor-default items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
