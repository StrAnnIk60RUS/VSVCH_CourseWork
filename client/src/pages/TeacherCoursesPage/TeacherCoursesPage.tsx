import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiError, getTeacherCourses } from '../../api';
import { PageShell, SectionCard } from '../../components/layout';

export default function TeacherCoursesPage() {
  const [items, setItems] = useState<
    Array<{ id: string; title: string; language: string; level: string; lessonCount: number; enrollmentCount: number }>
  >([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getTeacherCourses()
      .then((res) => setItems(res.items))
      .catch((err) => setError(getApiError(err)));
  }, []);

  return (
    <PageShell title="Курсы преподавателя" description="Ваши курсы и переход к управлению.">
      <SectionCard title="Список курсов">
        <Link to="/teacher/courses/new" className="inline-block rounded border border-slate-300 px-3 py-2">
          Создать курс
        </Link>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="rounded border border-slate-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-slate-600">
                    {item.language} • {item.level} • уроков {item.lessonCount} • студентов {item.enrollmentCount}
                  </p>
                </div>
                <Link to={`/teacher/courses/${item.id}`} className="rounded border border-slate-300 px-2 py-1">
                  Управлять
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </PageShell>
  );
}
