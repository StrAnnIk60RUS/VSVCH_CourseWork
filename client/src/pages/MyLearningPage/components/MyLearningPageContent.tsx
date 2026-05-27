import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  downloadCertificatePdf,
  getApiError,
  getEnrollments,
  issueCertificate,
  unenrollFromCourse,
} from '../../../api';
import type { EnrollmentCertificate } from '../../../api';
import { NavigationUp, PageShell, SectionCard } from '../../../components/layout';
import { useI18n } from '../../../hooks/useI18n';
import { formatDate } from '../../../utils/dateTime';

type EnrollmentItem = {
  courseId: string;
  progress: number;
  course: { title: string };
  certificate: EnrollmentCertificate | null;
};

function formatIssuedAt(value: string): string {
  return formatDate(value, value);
}

export function MyLearningPageContent() {
  const t = useI18n();
  const [items, setItems] = useState<EnrollmentItem[]>([]);
  const [error, setError] = useState('');
  const [busyCourseId, setBusyCourseId] = useState<string | null>(null);

  useEffect(() => {
    getEnrollments()
      .then((res) => setItems(res.items))
      .catch((err) => setError(getApiError(err)));
  }, []);

  async function handleIssueCertificate(courseId: string) {
    setBusyCourseId(courseId);
    setError('');
    try {
      const cert = await issueCertificate(courseId);
      setItems((prev) =>
        prev.map((item) =>
          item.courseId === courseId
            ? {
                ...item,
                certificate: {
                  id: cert.id,
                  documentNumber: cert.documentNumber,
                  issuedAt: cert.issuedAt,
                },
              }
            : item,
        ),
      );
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setBusyCourseId(null);
    }
  }

  async function handleDownloadCertificate(cert: EnrollmentCertificate) {
    setError('');
    try {
      await downloadCertificatePdf(cert.id, cert.documentNumber);
    } catch (err) {
      setError(getApiError(err));
    }
  }

  return (
    <PageShell title={t.myLearning.pageTitle} description={t.myLearning.pageDescription}>
      <NavigationUp
        links={[
          { to: '/courses', label: t.myLearning.catalog },
          { to: '/', label: t.myLearning.home },
        ]}
      />
      <SectionCard title={t.myLearning.enrollments}>
        {error && <p className="text-sm text-ui-danger">{error}</p>}
        <ul className="mt-3 space-y-2">
          {items.map((item) => {
            const isCompleted = item.progress === 100;
            const cert = item.certificate;
            const isBusy = busyCourseId === item.courseId;
            return (
              <li
                key={item.courseId}
                className="ui-card-interactive rounded border border-ui-border bg-ui-surface p-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium">{item.course.title}</p>
                    <p className="text-sm text-ui-muted">{t.myLearning.progress}: {item.progress}%</p>
                    {cert && (
                      <p className="mt-1 text-sm text-ui-success">
                        {t.myLearning.certIssued}{cert.documentNumber} ({formatIssuedAt(cert.issuedAt)})
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/courses/${item.courseId}`} className="ui-btn-secondary text-sm">
                      {t.myLearning.toCourse}
                    </Link>
                    {isCompleted && !cert && (
                      <button
                        type="button"
                        onClick={() => handleIssueCertificate(item.courseId)}
                        disabled={isBusy}
                        className="ui-btn-primary text-sm"
                      >
                        {isBusy ? t.myLearning.issuing : t.myLearning.issueCertificate}
                      </button>
                    )}
                    {cert && (
                      <button
                        type="button"
                        onClick={() => handleDownloadCertificate(cert)}
                        className="ui-btn-secondary text-sm"
                      >
                        {t.myLearning.downloadPdf}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={async () => {
                        await unenrollFromCourse(item.courseId);
                        setItems((prev) => prev.filter((x) => x.courseId !== item.courseId));
                      }}
                      className="ui-btn-danger text-sm"
                    >
                      {t.myLearning.unenroll}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </SectionCard>
    </PageShell>
  );
}
