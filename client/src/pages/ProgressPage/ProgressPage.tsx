import { useEffect, useState } from 'react';
import { downloadReport, getApiError, getSubmissions, sendReportEmail } from '../../api';
import { NavigationUp, PageShell, SectionCard } from '../../components/layout';
import { useI18n } from '../../hooks/useI18n';

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ProgressPage() {
  const t = useI18n();
  const [submissions, setSubmissions] = useState<Array<{ id: string; createdAt: string; score: number; exercise: { title: string; lesson?: { title: string } } }>>([]);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    getSubmissions()
      .then((res) => setSubmissions(res.items))
      .catch((err) => setStatus(getApiError(err)));
  }, []);

  return (
    <PageShell title={t.progress.pageTitle} description={t.progress.pageDescription}>
      <div className="space-y-4">
        <NavigationUp
          links={[
            { to: '/me/learning', label: 'Моё обучение' },
            { to: '/courses', label: 'Каталог курсов' },
            { to: '/', label: 'На главную' },
          ]}
        />
        <SectionCard title={t.progress.history}>
          <ul className="mt-2 space-y-2">
            {submissions.map((s) => (
              <li key={s.id} className="rounded border border-ui-border bg-ui-surface p-3 text-sm text-ui-muted">
                <span className="font-medium">{s.exercise.title}</span> • {s.score} •{' '}
                {new Date(s.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title={t.progress.reports}>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={async () => saveBlob(await downloadReport('student-progress', 'pdf'), 'student-progress.pdf')}
              className="ui-button-secondary rounded px-3 py-2"
            >
              {t.progress.downloadPdf}
            </button>
            <button
              type="button"
              onClick={async () => saveBlob(await downloadReport('student-progress', 'docx'), 'student-progress.docx')}
              className="ui-button-secondary rounded px-3 py-2"
            >
              {t.progress.downloadDocx}
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="email@example.com"
              className="ui-input w-full rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={async () => {
                const res = await sendReportEmail({
                  email,
                  type: 'student-progress',
                  format: 'pdf',
                });
                setStatus(res.message ?? (res.sent ? t.progress.emailSent : t.progress.demoMode));
              }}
              className="ui-button-secondary rounded px-3 py-2"
            >
              {t.progress.sendEmail}
            </button>
          </div>
          {status && <p className="mt-2 text-sm text-ui-muted">{status}</p>}
        </SectionCard>
      </div>
    </PageShell>
  );
}
