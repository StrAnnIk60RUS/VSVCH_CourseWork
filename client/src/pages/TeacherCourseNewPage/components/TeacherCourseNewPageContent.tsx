import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse, getApiError } from '../../../api';
import { COURSE_LANGUAGES, COURSE_LEVEL_OPTIONS } from '../../../constants/courseOptions';
import { NavigationUp, PageShell, SectionCard } from '../../../components/layout';
import { useI18n } from '../../../hooks/useI18n';

export function TeacherCourseNewPageContent() {
  const t = useI18n();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('en');
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
    <PageShell title={t.teacherNewCourse.pageTitle} description={t.teacherNewCourse.pageDescription}>
      <NavigationUp links={[{ to: '/teacher/courses', label: t.teacherNewCourse.backToCourses }]} />
      <SectionCard title={t.teacherNewCourse.formTitle}>
        <form onSubmit={onSubmit} className="mt-2 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder={t.teacherNewCourse.title}
            className="ui-input w-full rounded px-3 py-2"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.teacherNewCourse.description}
            className="ui-input w-full rounded px-3 py-2"
          />
          <div className="grid gap-2 md:grid-cols-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="ui-input rounded px-3 py-2"
            >
              {COURSE_LANGUAGES.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="ui-input rounded px-3 py-2"
            >
              {COURSE_LEVEL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="ui-btn-primary">
            {t.teacherNewCourse.create}
          </button>
          {status && <p className="text-sm text-ui-danger">{status}</p>}
        </form>
      </SectionCard>
    </PageShell>
  );
}
