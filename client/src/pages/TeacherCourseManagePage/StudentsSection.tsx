import type { StudentItem } from './useTeacherCourseManage';

type Props = {
  students: StudentItem[];
  statusFilter: string;
  sort: string;
  setStatusFilter: (value: string) => void;
  setSort: (value: string) => void;
  onDownloadCsv: () => Promise<void>;
};

export function StudentsSection({ students, statusFilter, sort, setStatusFilter, setSort, onDownloadCsv }: Props) {
  return (
    <>
      <div className="mb-2 flex flex-wrap gap-2">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded border border-slate-300 px-3 py-2">
          <option value="all">Все</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded border border-slate-300 px-3 py-2">
          <option value="name">Имя</option>
          <option value="progress">Прогресс</option>
          <option value="activity">Активность</option>
        </select>
        <button type="button" onClick={() => onDownloadCsv()} className="rounded border border-slate-300 px-3 py-2">
          Скачать CSV
        </button>
      </div>
      <ul className="space-y-2">
        {students.map((s) => (
          <li key={s.userId} className="rounded border border-slate-200 p-3 text-sm">
            {s.name} ({s.email}) • {s.progress}% • {s.active ? 'active' : 'inactive'}
          </li>
        ))}
      </ul>
    </>
  );
}
