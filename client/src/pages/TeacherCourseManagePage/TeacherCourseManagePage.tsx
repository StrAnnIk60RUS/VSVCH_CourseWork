import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  createExercise,
  createLesson,
  deleteExercise,
  deleteLesson,
  downloadReport,
  downloadTeacherStudentsCsv,
  getApiError,
  getCourseById,
  getTeacherStudents,
  sendReportEmail,
} from '../../api';
import { PageShell, SectionCard } from '../../components/layout';

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function TeacherCourseManagePage() {
  const { courseId = '' } = useParams();
  const [course, setCourse] = useState<{ title: string; lessons: Array<{ id: string; title: string }> } | null>(null);
  const [students, setStudents] = useState<
    Array<{ userId: string; name: string; email: string; progress: number; active: boolean }>
  >([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('name');
  const [status, setStatus] = useState('');

  useEffect(() => {
    getCourseById(courseId)
      .then((res) => setCourse({ title: res.title, lessons: res.lessons }))
      .catch((err) => setStatus(getApiError(err)));
  }, [courseId]);

  useEffect(() => {
    getTeacherStudents(courseId, { status: statusFilter, sort, order: 'asc' })
      .then((res) => setStudents(res.items))
      .catch((err) => setStatus(getApiError(err)));
  }, [courseId, sort, statusFilter]);

  return (
    <PageShell title={`Управление: ${course?.title ?? ''}`} description="CRUD контента, аналитика и отчеты преподавателя.">
      <div className="space-y-4">
        <SectionCard title="Уроки и упражнения">
          <div className="mb-2 flex gap-2">
            <button
              type="button"
              onClick={async () => {
                await createLesson(courseId, { title: 'Новый урок', content: '' });
                setStatus('Урок создан');
              }}
              className="rounded border border-slate-300 px-3 py-2"
            >
              Добавить урок
            </button>
          </div>
          <ul className="space-y-2">
            {course?.lessons.map((lesson) => (
              <li key={lesson.id} className="rounded border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span>{lesson.title}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await createExercise(courseId, lesson.id, {
                          title: 'New exercise',
                          question: 'Question',
                          correctAnswer: 'Answer',
                          maxScore: 10,
                        });
                        setStatus('Упражнение создано');
                      }}
                      className="rounded border border-slate-300 px-2 py-1"
                    >
                      + упражнение
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const targetExerciseId = prompt('Введите exerciseId для удаления');
                        if (targetExerciseId) {
                          await deleteExercise(courseId, lesson.id, targetExerciseId);
                          setStatus('Упражнение удалено');
                        }
                      }}
                      className="rounded border border-slate-300 px-2 py-1"
                    >
                      - упражнение
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await deleteLesson(courseId, lesson.id);
                        setCourse((prev) =>
                          prev
                            ? { ...prev, lessons: prev.lessons.filter((x) => x.id !== lesson.id) }
                            : prev,
                        );
                      }}
                      className="rounded border border-slate-300 px-2 py-1"
                    >
                      Удалить урок
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Студенты и CSV">
          <div className="mb-2 flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded border border-slate-300 px-3 py-2"
            >
              <option value="all">Все</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded border border-slate-300 px-3 py-2"
            >
              <option value="name">Имя</option>
              <option value="progress">Прогресс</option>
              <option value="activity">Активность</option>
            </select>
            <button
              type="button"
              onClick={async () =>
                saveBlob(await downloadTeacherStudentsCsv(courseId), `course-${courseId}-students.csv`)
              }
              className="rounded border border-slate-300 px-3 py-2"
            >
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
        </SectionCard>

        <SectionCard title="Отчеты и e-mail">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={async () => saveBlob(await downloadReport('course-summary', 'pdf', courseId), `course-${courseId}.pdf`)}
              className="rounded border border-slate-300 px-3 py-2"
            >
              PDF summary
            </button>
            <button
              type="button"
              onClick={async () => saveBlob(await downloadReport('course-summary', 'docx', courseId), `course-${courseId}.docx`)}
              className="rounded border border-slate-300 px-3 py-2"
            >
              DOCX summary
            </button>
            <button
              type="button"
              onClick={async () => {
                const email = prompt('Email для отправки отчета');
                if (!email) {
                  return;
                }
                const res = await sendReportEmail({
                  email,
                  type: 'course-summary',
                  format: 'pdf',
                  courseId,
                });
                setStatus(res.message ?? (res.sent ? 'Письмо отправлено' : 'Demo-режим'));
              }}
              className="rounded border border-slate-300 px-3 py-2"
            >
              Отправить e-mail
            </button>
          </div>
          {status && <p className="mt-2 text-sm">{status}</p>}
        </SectionCard>
      </div>
    </PageShell>
  );
}
