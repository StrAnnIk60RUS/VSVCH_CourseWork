import { useEffect, useState } from 'react';
import {
  downloadReport,
  getApiError,
  getSubmissions,
  sendReportEmail,
  type SubmissionListItem,
} from '../../../api';
import { NavigationUp, PageShell, SectionCard } from '../../../components/layout';
import { useI18n } from '../../../hooks/useI18n';
import { useToast } from '../../../hooks/useToast';
import { formatDateTime } from '../../../utils/dateTime';

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ProgressPageContent() {
  const t = useI18n();
  const { showSuccess, showError } = useToast();
  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([]);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    getSubmissions()
      .then((res) => setSubmissions(res.items))
      .catch((err) => setStatus(getApiError(err)));
  }, []);

  return (
    <PageShell title={t.progress.pageTitle} description={t.progress.pageDescription}>
      <div className="progress-page__stack">
        <NavigationUp
          links={[
            { to: '/me/learning', label: t.progress.myLearningLink },
            { to: '/courses', label: t.progress.coursesLink },
            { to: '/', label: t.progress.homeLink },
          ]}
        />
        <SectionCard title={t.progress.history}>
          <ul className="mt-2 space-y-2">
            {submissions.map((s) => (
              <li key={s.id} className="rounded border border-ui-border bg-ui-surface p-3 text-sm text-ui-muted">
                <span className="font-medium">{s.exercise.title}</span> • {s.score} •{' '}
                {formatDateTime(s.createdAt)}
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title={t.progress.reports}>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={async () => {
                try {
                  saveBlob(await downloadReport('student-progress', 'pdf'), 'student-progress.pdf');
                  showSuccess(t.progress.reportDownloadedPdf);
                } catch (err) {
                  setStatus(getApiError(err));
                  showError(getApiError(err));
                }
              }}
              className="ui-button-secondary rounded px-3 py-2"
            >
              {t.progress.downloadPdf}
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  saveBlob(await downloadReport('student-progress', 'docx'), 'student-progress.docx');
                  showSuccess(t.progress.reportDownloadedDocx);
                } catch (err) {
                  setStatus(getApiError(err));
                  showError(getApiError(err));
                }
              }}
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
              placeholder={t.progress.emailPlaceholder}
              className="ui-input w-full rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={async () => {
                setSendingEmail(true);
                setStatus('');
                try {
                  const res = await sendReportEmail({
                    email,
                    type: 'student-progress',
                    format: 'pdf',
                  });
                  const message = res.message ?? (res.sent ? t.progress.emailSent : t.progress.demoMode);
                  setStatus(message);
                  showSuccess(message);
                } catch (err) {
                  setStatus(getApiError(err));
                  showError(getApiError(err));
                } finally {
                  setSendingEmail(false);
                }
              }}
              className="ui-button-secondary rounded px-3 py-2"
              disabled={sendingEmail}
            >
              {sendingEmail ? `${t.progress.sendEmail}...` : t.progress.sendEmail}
            </button>
          </div>
          {status && <p className="mt-2 text-sm text-ui-muted">{status}</p>}
        </SectionCard>
      </div>
    </PageShell>
  );
}
