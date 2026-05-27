import { useEffect, useState } from 'react';
import { clearUiStorage } from '../../../constants/storage';
import {
  downloadCertificatePdf,
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
  coursesTotal: number;
  coursesPublished: number;
  studentsTotal: number;
  lessonsTotal: number;
  reviewsTotal: number;
  avgRating: number;
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
          .then((coursesRes) => {
            if (coursesRes.items.length === 0) {
              return null;
            }
            const coursesTotal = coursesRes.items.length;
            const coursesPublished = coursesRes.items.filter((course) => course.published).length;
            const studentsTotal = coursesRes.items.reduce(
              (sum, course) => sum + (Number(course.enrollmentCount) || 0),
              0,
            );
            const lessonsTotal = coursesRes.items.reduce(
              (sum, course) => sum + (Number(course.lessonCount) || 0),
              0,
            );
            const reviewsTotal = coursesRes.items.reduce(
              (sum, course) => sum + (Number(course.reviewCount) || 0),
              0,
            );
            const ratedCourses = coursesRes.items.filter(
              (course) => course.ratingAverage != null && course.reviewCount > 0,
            );
            const avgRating =
              ratedCourses.length > 0
                ? Number(
                    (
                      ratedCourses.reduce(
                        (sum, course) => sum + Number(course.ratingAverage ?? 0),
                        0,
                      ) / ratedCourses.length
                    ).toFixed(1),
                  )
                : 0;
            return {
              coursesTotal,
              coursesPublished,
              studentsTotal,
              lessonsTotal,
              reviewsTotal,
              avgRating,
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
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded border border-ui-border bg-ui-surface p-3">
                    <p className="text-xs text-ui-muted">{t.profile.teacherCoursesTotal}</p>
                    <p className="mt-1 text-xl font-semibold text-ui-text">{teacherStats.coursesTotal}</p>
                  </div>
                  <div className="rounded border border-ui-border bg-ui-surface p-3">
                    <p className="text-xs text-ui-muted">{t.profile.teacherCoursesPublished}</p>
                    <p className="mt-1 text-xl font-semibold text-ui-text">{teacherStats.coursesPublished}</p>
                  </div>
                  <div className="rounded border border-ui-border bg-ui-surface p-3">
                    <p className="text-xs text-ui-muted">{t.teacherAnalytics.students}</p>
                    <p className="mt-1 text-xl font-semibold text-ui-text">{teacherStats.studentsTotal}</p>
                  </div>
                  <div className="rounded border border-ui-border bg-ui-surface p-3">
                    <p className="text-xs text-ui-muted">{t.teacherCourses.lessons}</p>
                    <p className="mt-1 text-xl font-semibold text-ui-text">{teacherStats.lessonsTotal}</p>
                  </div>
                  <div className="rounded border border-ui-border bg-ui-surface p-3">
                    <p className="text-xs text-ui-muted">{t.teacherCourses.reviews}</p>
                    <p className="mt-1 text-xl font-semibold text-ui-text">{teacherStats.reviewsTotal}</p>
                  </div>
                  <div className="rounded border border-ui-border bg-ui-surface p-3">
                    <p className="text-xs text-ui-muted">{t.profile.teacherAverageRating}</p>
                    <p className="mt-1 text-xl font-semibold text-ui-text">
                      {teacherStats.avgRating > 0 ? teacherStats.avgRating.toFixed(1) : t.teacherCourses.notAvailable}
                    </p>
                  </div>
                </div>
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
