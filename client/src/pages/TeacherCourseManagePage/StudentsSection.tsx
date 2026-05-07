import type { StudentItem } from './useTeacherCourseManage';
import { useI18n } from '../../hooks/useI18n';

type Props = {
  students: StudentItem[];
  statusFilter: string;
  sort: string;
  setStatusFilter: (value: string) => void;
  setSort: (value: string) => void;
  onDownloadCsv: () => Promise<void>;
};

export function StudentsSection({ students, statusFilter, sort, setStatusFilter, setSort, onDownloadCsv }: Props) {
  const t = useI18n();
  return (
    <>
      <div className="mb-2 flex flex-wrap gap-2">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="ui-input rounded px-3 py-2">
          <option value="all">{t.teacherStudents.all}</option>
          <option value="active">{t.teacherStudents.active}</option>
          <option value="inactive">{t.teacherStudents.inactive}</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="ui-input rounded px-3 py-2">
          <option value="name">{t.teacherStudents.name}</option>
          <option value="progress">{t.teacherStudents.progress}</option>
          <option value="activity">{t.teacherStudents.activity}</option>
        </select>
        <button type="button" onClick={() => onDownloadCsv()} className="ui-btn-secondary">
          {t.teacherStudents.downloadCsv}
        </button>
      </div>
      <ul className="space-y-2">
        {students.map((s) => (
          <li
            key={s.userId}
            className="ui-card-interactive rounded border border-ui-border bg-ui-surface p-3 text-sm text-ui-text"
          >
            {s.name} ({s.email}) • {s.progress}% • {s.active ? t.teacherStudents.active : t.teacherStudents.inactive}
          </li>
        ))}
      </ul>
    </>
  );
}
