import { CourseCardPlaceholder } from './CourseCardPlaceholder';

const PLACEHOLDER_LABELS = [
  'Пример карточки курса 1',
  'Пример карточки курса 2',
  'Пример карточки курса 3',
];

export function CoursesCatalogList() {
  return (
    <section aria-labelledby="courses-list-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 id="courses-list-heading" className="text-lg font-semibold text-slate-900">
          Список курсов
        </h2>
        <p className="text-sm text-slate-500">Показаны примеры карточек</p>
      </div>
      <div
        role="list"
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      >
        {PLACEHOLDER_LABELS.map((label) => (
          <div key={label} role="listitem" className="min-w-0">
            <CourseCardPlaceholder label={label} />
          </div>
        ))}
      </div>
    </section>
  );
}
