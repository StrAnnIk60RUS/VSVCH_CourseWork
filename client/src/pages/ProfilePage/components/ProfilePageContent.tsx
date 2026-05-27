import { useEffect, useState } from 'react';
import { clearUiStorage } from '../../../constants/storage';
import {
  downloadCertificatePdf,
  getTeacherAnalytics,
  getTeacherCourses,
  getApiError,
  getMyCertificates,
  getProfile,
  updateProfileName,
} from '../../../api';
import { PageShell, SectionCard } from '../../../components/layout';
import { useAuthSession } from '../../../hooks/useAuthSession';
import { useI18n } from '../../../hooks/useI18n';
import { useToast } from '../../../hooks/useToast';

type ProfileCertificate = {
  id: string;
  documentNumber: string;
  issuedAt: string;
  course: { title: string } | null;
};

type TeacherStats = {
  courseTitle: string;
  periodDays: number;
  students: number;
  avgProgress: number;
  activeStudents: number;
  riskStudents: number;
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
}

export function ProfilePageContent() {
  const t = useI18n();
  const { user } = useAuthSession();
  const { showSuccess, showError } = useToast();
  const isTeacher = Boolean(user?.roles.includes('TEACHER'));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [certificates, setCertificates] = useState<ProfileCertificate[]>([]);
  const [downloadingCertificateId, setDownloadingCertificateId] = useState<string | null>(null);
  const [teacherStats, setTeacherStats] = useState<TeacherStats | null>(null);

  useEffect(() => {
    const profilePromise = getProfile();
    const certsPromise = isTeacher ? Promise.resolve({ items: [] as ProfileCertificate[] }) : getMyCertificates();
    const teacherStatsPromise = isTeacher
      ? getTeacherCourses()
          .then(async (coursesRes) => {
            if (coursesRes.items.length === 0) {
              return null;
            }
            const topCourse = [...coursesRes.items].sort(
              (a, b) => b.enrollmentCount - a.enrollmentCount,
            )[0];
            const analytics = await getTeacherAnalytics(topCourse.id, 7);
            return {
              courseTitle: topCourse.title,
              periodDays: analytics.periodDays,
              students: analytics.kpis.students,
              avgProgress: analytics.kpis.avgProgress,
              activeStudents: analytics.kpis.activeStudents7d,
              riskStudents: analytics.kpis.riskStudents,
            } satisfies TeacherStats;
          })
      : Promise.resolve(null);

    Promise.all([profilePromise, certsPromise, teacherStatsPromise])
      .then(([profile, certs, stats]) => {
        setName(profile.name);
        setEmail(profile.email);
        setCertificates(certs.items);
        setTeacherStats(stats);
      })
      .catch((err) => {
        const message = getApiError(err);
        setStatus(message);
        showError(message);
      });
  }, [isTeacher, showError]);

  return (
    <PageShell title={t.profile.pageTitle} description={t.profile.pageDescription}>
      <div className="profile-page__stack">
        <SectionCard title={t.profile.profileData}>
          <p className="text-sm text-ui-muted">
            {t.profile.email}: {email}
          </p>
          <div className="mt-3 flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="ui-input w-full rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={async () => {
                try {
                  await updateProfileName(name);
                  setStatus(t.profile.nameUpdated);
                  showSuccess(t.profile.nameUpdated);
                } catch (err) {
                  const message = getApiError(err);
                  setStatus(message);
                  showError(message);
                }
              }}
              className="ui-btn-primary"
            >
              {t.profile.save}
            </button>
          </div>
        </SectionCard>
        {isTeacher ? (
          <SectionCard title={t.profile.teacherMiniStats}>
            {!teacherStats && (
              <p className="text-sm text-ui-muted">{t.profile.teacherStatsNoCourses}</p>
            )}
            {teacherStats && (
              <div className="mt-2 space-y-3">
                <p className="text-sm text-ui-muted">
                  {t.profile.teacherStatsCourse}: <span className="font-medium text-ui-text">{teacherStats.courseTitle}</span>
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded border border-ui-border bg-ui-surface p-3">
                    <p className="text-xs text-ui-muted">{t.teacherAnalytics.students}</p>
                    <p className="mt-1 text-xl font-semibold text-ui-text">{teacherStats.students}</p>
                  </div>
                  <div className="rounded border border-ui-border bg-ui-surface p-3">
                    <p className="text-xs text-ui-muted">{t.teacherAnalytics.avgProgress}</p>
                    <p className="mt-1 text-xl font-semibold text-ui-text">{teacherStats.avgProgress}%</p>
                  </div>
                  <div className="rounded border border-ui-border bg-ui-surface p-3">
                    <p className="text-xs text-ui-muted">
                      {t.teacherAnalytics.activePeriod} ({teacherStats.periodDays})
                    </p>
                    <p className="mt-1 text-xl font-semibold text-ui-text">{teacherStats.activeStudents}</p>
                  </div>
                  <div className="rounded border border-ui-border bg-ui-surface p-3">
                    <p className="text-xs text-ui-muted">{t.teacherAnalytics.riskStudents}</p>
                    <p className="mt-1 text-xl font-semibold text-ui-text">{teacherStats.riskStudents}</p>
                  </div>
                </div>
                <p className="text-xs text-ui-muted">{t.teacherAnalytics.riskDefinition}</p>
              </div>
            )}
          </SectionCard>
        ) : (
          <SectionCard title={t.profile.certificates}>
            {certificates.length === 0 && (
              <p className="text-sm text-ui-muted">{t.profile.certificatesEmpty}</p>
            )}
            {certificates.length > 0 && (
              <ul className="mt-2 space-y-2">
                {certificates.map((certificate) => (
                  <li
                    key={certificate.id}
                    className="ui-card-interactive rounded border border-ui-border bg-ui-surface p-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium">
                          {certificate.course?.title ?? t.courseDetail.titleFallback}
                        </p>
                        <p className="text-sm text-ui-muted">
                          {t.profile.certificateNumber}: {certificate.documentNumber}
                        </p>
                        <p className="text-sm text-ui-muted">
                          {t.profile.certificateIssuedAt}: {formatDate(certificate.issuedAt)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          setStatus('');
                          setDownloadingCertificateId(certificate.id);
                          try {
                            await downloadCertificatePdf(
                              certificate.id,
                              certificate.documentNumber,
                            );
                            showSuccess(t.profile.certificateDownloaded);
                          } catch (err) {
                            const message = getApiError(err);
                            setStatus(message);
                            showError(message);
                          } finally {
                            setDownloadingCertificateId(null);
                          }
                        }}
                        className="ui-btn-secondary"
                        disabled={downloadingCertificateId === certificate.id}
                      >
                        {t.profile.downloadPdf}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        )}
        <SectionCard title={t.profile.resetUi}>
          <button
            type="button"
            onClick={() => {
              clearUiStorage();
              setStatus(t.profile.localSettingsReset);
              showSuccess(t.profile.localSettingsReset);
            }}
            className="ui-button-secondary rounded px-3 py-2"
          >
            {t.profile.resetButton}
          </button>
        </SectionCard>
        {status && <p className="text-sm text-ui-muted">{status}</p>}
      </div>
    </PageShell>
  );
}
