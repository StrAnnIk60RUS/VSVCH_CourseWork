import { useEffect, useState } from 'react';
import { downloadReport, getApiError, getSubmissions, sendReportEmail } from '../../api';
import { PageShell, SectionCard } from '../../components/layout';

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ProgressPage() {
  const [submissions, setSubmissions] = useState<Array<{ id: string; createdAt: string; score: number; exercise: { title: string; lesson?: { title: string } } }>>([]);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    getSubmissions()
      .then((res) => setSubmissions(res.items))
      .catch((err) => setStatus(getApiError(err)));
  }, []);

  return (
    <PageShell title="Прогресс" description="История отправок и отчеты в PDF/DOCX/e-mail.">
      <div className="space-y-4">
        <SectionCard title="История отправок">
          <ul className="mt-2 space-y-2">
            {submissions.map((s) => (
              <li key={s.id} className="rounded border border-slate-200 p-3 text-sm">
                <span className="font-medium">{s.exercise.title}</span> • {s.score} •{' '}
                {new Date(s.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Отчеты">
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={async () => saveBlob(await downloadReport('student-progress', 'pdf'), 'student-progress.pdf')}
              className="rounded border border-slate-300 px-3 py-2"
            >
              Скачать PDF
            </button>
            <button
              type="button"
              onClick={async () => saveBlob(await downloadReport('student-progress', 'docx'), 'student-progress.docx')}
              className="rounded border border-slate-300 px-3 py-2"
            >
              Скачать DOCX
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="email@example.com"
              className="w-full rounded border border-slate-300 px-3 py-2"
            />
            <button
              type="button"
              onClick={async () => {
                const res = await sendReportEmail({
                  email,
                  type: 'student-progress',
                  format: 'pdf',
                });
                setStatus(res.message ?? (res.sent ? 'Письмо отправлено' : 'Demo-режим'));
              }}
              className="rounded border border-slate-300 px-3 py-2"
            >
              Отправить на e-mail
            </button>
          </div>
          {status && <p className="mt-2 text-sm">{status}</p>}
        </SectionCard>
      </div>
    </PageShell>
  );
}
