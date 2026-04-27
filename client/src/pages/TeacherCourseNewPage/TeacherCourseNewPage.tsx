import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse, getApiError } from '../../api';
import { NavigationUp, PageShell, SectionCard } from '../../components/layout';

export default function TeacherCourseNewPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [level, setLevel] = useState('A1');
  const [status, setStatus] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const created = await createCourse({ title, description, language, level });
      navigate(`/teacher/courses/${created.id}`);
    } catch (err) {
      setStatus(getApiError(err));
    }
  };

  return (
    <PageShell title="Новый курс" description="Создание курса преподавателем.">
      <NavigationUp links={[{ to: '/teacher/courses', label: 'К списку моих курсов' }]} />
      <SectionCard title="Форма курса">
        <form onSubmit={onSubmit} className="mt-2 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Название"
            className="w-full rounded border border-slate-300 px-3 py-2"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание"
            className="w-full rounded border border-slate-300 px-3 py-2"
          />
          <div className="grid gap-2 md:grid-cols-2">
            <input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Язык"
              className="rounded border border-slate-300 px-3 py-2"
            />
            <input
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Уровень"
              className="rounded border border-slate-300 px-3 py-2"
            />
          </div>
          <button type="submit" className="rounded border border-slate-300 px-3 py-2">
            Создать
          </button>
          {status && <p className="text-sm text-red-600">{status}</p>}
        </form>
      </SectionCard>
    </PageShell>
  );
}
