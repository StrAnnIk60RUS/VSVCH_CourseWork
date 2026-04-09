import {
  CoursesCatalogActions,
  CoursesCatalogFilters,
  CoursesCatalogHeader,
  CoursesCatalogList,
  CoursesCatalogNav,
  CoursesCatalogSortPagination,
  CoursesCatalogSummary,
} from '../../components/courses';

export default function CoursesPage() {
  return (
    <div className="min-h-dvh bg-slate-50">
      <CoursesCatalogHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_17.5rem] lg:items-start xl:grid-cols-[1fr_20rem]">
          <div className="min-w-0 space-y-6">
            <CoursesCatalogNav />
            <CoursesCatalogFilters />
            <CoursesCatalogSortPagination />
            <CoursesCatalogList />
          </div>
          <CoursesCatalogSummary />
        </div>
        <CoursesCatalogActions />
      </main>
    </div>
  );
}
