export function CoursesCatalogActions() {
  return (
    <footer className="mt-10 border-t border-slate-200 pt-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Действия каталога</h2>
          <p className="mt-1 text-sm text-slate-600">
            Сброс фильтров и альтернативные сценарии обзора — подключатся к состоянию позже.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex cursor-default items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            Сбросить фильтры
          </span>
          <span className="inline-flex cursor-default items-center justify-center rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800">
            Сохранить вид
          </span>
        </div>
      </div>
    </footer>
  );
}
