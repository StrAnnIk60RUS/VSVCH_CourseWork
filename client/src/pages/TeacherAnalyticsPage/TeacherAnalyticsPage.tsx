import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  downloadReport,
  downloadTeacherStudentsCsv,
  getApiError,
  getTeacherAnalytics,
  getTeacherCourses,
  sendReportEmail,
  type TeacherAnalyticsResponse,
} from '../../api';
import { PageShell, SectionCard } from '../../components/layout';
import { useAuthSession } from '../../hooks/useAuthSession';
import { useI18n } from '../../hooks/useI18n';

type Period = 7 | 30 | 90;

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDay(date: string) {
  return new Date(date).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
}

export default function TeacherAnalyticsPage() {
  const t = useI18n();
  const { user } = useAuthSession();
  const userEmail = user?.email ?? '';
  const [courses, setCourses] = useState<Array<{ id: string; title: string }>>([]);
  const [courseId, setCourseId] = useState('');
  const [period, setPeriod] = useState<Period>(30);
  const [analytics, setAnalytics] = useState<TeacherAnalyticsResponse | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [riskOnly, setRiskOnly] = useState(false);

  useEffect(() => {
    getTeacherCourses()
      .then((res) => {
        const mapped = res.items.map((item) => ({ id: item.id, title: item.title }));
        setCourses(mapped);
        if (mapped.length > 0) {
          setCourseId(mapped[0].id);
        }
      })
      .catch((err) => setStatus(getApiError(err)));
  }, []);

  useEffect(() => {
    if (!courseId) {
      return;
    }
    getTeacherAnalytics(courseId, period)
      .then((res) => {
        setAnalytics(res);
        setStatus('');
        setLoading(false);
      })
      .catch((err) => {
        setAnalytics(null);
        setStatus(getApiError(err));
        setLoading(false);
      });
  }, [courseId, period]);

  const distributionData = useMemo(
    () =>
      analytics
        ? [
            { key: '0-25', label: '0-25%', value: analytics.progressBuckets.p0_25, color: '#ef4444' },
            { key: '26-50', label: '26-50%', value: analytics.progressBuckets.p26_50, color: '#f97316' },
            { key: '51-75', label: '51-75%', value: analytics.progressBuckets.p51_75, color: '#3b82f6' },
            { key: '76-100', label: '76-100%', value: analytics.progressBuckets.p76_100, color: '#10b981' },
          ]
        : [],
    [analytics],
  );

  const studentsProgressData = useMemo(() => {
    const base = analytics?.students ?? [];
    const filtered = riskOnly ? base.filter((item) => item.progress < 40 || item.inactiveDays >= 14) : base;
    return [...filtered]
      .sort((a, b) => a.progress - b.progress)
      .slice(0, 12)
      .map((item) => ({
        userId: item.userId,
        name: item.name,
        progress: item.progress,
        inactiveDays: item.inactiveDays,
      }));
  }, [analytics, riskOnly]);

  const currentCourseTitle = courses.find((item) => item.id === courseId)?.title ?? '';

  return (
    <PageShell title={t.teacherAnalytics.pageTitle} description={t.teacherAnalytics.pageDescription}>
      <div className="space-y-4">
        <SectionCard title={t.teacherAnalytics.chooseCourse}>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm text-ui-muted">
              {t.teacherAnalytics.chooseCourse}
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="ui-select"
                aria-label={t.teacherAnalytics.chooseCourse}
              >
                {courses.length === 0 ? (
                  <option value="">{t.teacherAnalytics.chooseCoursePlaceholder}</option>
                ) : null}
                {courses.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-ui-muted">
              {t.teacherAnalytics.period}
              <select
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value) as Period)}
                className="ui-select"
                aria-label={t.teacherAnalytics.period}
              >
                <option value={7}>7</option>
                <option value={30}>30</option>
                <option value={90}>90</option>
              </select>
            </label>

            <div className="flex items-end">
              <button
                type="button"
                className="ui-btn-secondary"
                onClick={async () => {
                  if (!userEmail || !courseId) {
                    return;
                  }
                  const response = await sendReportEmail({
                    email: userEmail,
                    type: 'course-summary',
                    format: 'pdf',
                    courseId,
                  });
                  setStatus(response.message ?? 'OK');
                }}
                disabled={!courseId || !userEmail}
              >
                {t.teacherAnalytics.sendEmail}
              </button>
            </div>
          </div>
          {status ? <p className="mt-2 text-sm text-ui-muted">{status}</p> : null}
        </SectionCard>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SectionCard title={t.teacherAnalytics.students}>
            <p className="text-3xl font-semibold text-ui-text">{analytics?.kpis.students ?? 0}</p>
          </SectionCard>
          <SectionCard title={t.teacherAnalytics.avgProgress}>
            <p className="text-3xl font-semibold text-ui-text">{analytics?.kpis.avgProgress ?? 0}%</p>
          </SectionCard>
          <SectionCard title={t.teacherAnalytics.active7d}>
            <p className="text-3xl font-semibold text-ui-text">{analytics?.kpis.activeStudents7d ?? 0}</p>
          </SectionCard>
          <SectionCard title={t.teacherAnalytics.riskStudents}>
            <p className="text-3xl font-semibold text-ui-text">{analytics?.kpis.riskStudents ?? 0}</p>
            <p className="mt-1 text-xs text-ui-muted">{t.teacherAnalytics.riskDefinition}</p>
          </SectionCard>
        </div>

        <SectionCard title={t.teacherAnalytics.submissionsTrend}>
          {!analytics || analytics.timeline.length === 0 || loading ? (
            <p className="text-sm text-ui-muted">{t.teacherAnalytics.noData}</p>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDay} />
                  <YAxis allowDecimals={false} />
                  <Tooltip labelFormatter={formatDay} />
                  <Line type="monotone" dataKey="submissions" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="activeStudents" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        <div className="grid gap-3 xl:grid-cols-2">
          <SectionCard title={t.teacherAnalytics.progressDistribution}>
            {!analytics || distributionData.every((item) => item.value === 0) ? (
              <p className="text-sm text-ui-muted">{t.teacherAnalytics.noData}</p>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value">
                      {distributionData.map((entry) => (
                        <Cell key={entry.key} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </SectionCard>

          <SectionCard title={t.teacherAnalytics.studentsProgress}>
            <div className="mb-2 flex items-center gap-2">
              <button type="button" className="ui-btn-secondary text-xs" onClick={() => setRiskOnly(false)}>
                {t.teacherAnalytics.allStudents}
              </button>
              <button type="button" className="ui-btn-secondary text-xs" onClick={() => setRiskOnly(true)}>
                {t.teacherAnalytics.riskOnly}
              </button>
            </div>
            <p className="mb-2 text-xs text-ui-muted">{t.teacherAnalytics.riskDefinition}</p>
            {studentsProgressData.length === 0 ? (
              <p className="text-sm text-ui-muted">{t.teacherAnalytics.noData}</p>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studentsProgressData} layout="vertical" margin={{ left: 16, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip />
                    <Bar dataKey="progress" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </SectionCard>
        </div>

        <SectionCard title={currentCourseTitle || t.teacherAnalytics.pageTitle}>
          <div className="flex flex-wrap gap-2">
            <Link to={`/teacher/courses/${courseId}`} className="ui-btn-secondary">
              {t.teacherAnalytics.viewManage}
            </Link>
            <button
              type="button"
              className="ui-btn-secondary"
              onClick={async () => {
                if (!courseId) return;
                saveBlob(await downloadReport('course-summary', 'pdf', courseId), `course-${courseId}.pdf`);
              }}
            >
              {t.teacherAnalytics.exportPdf}
            </button>
            <button
              type="button"
              className="ui-btn-secondary"
              onClick={async () => {
                if (!courseId) return;
                saveBlob(await downloadReport('course-summary', 'docx', courseId), `course-${courseId}.docx`);
              }}
            >
              {t.teacherAnalytics.exportDocx}
            </button>
            <button
              type="button"
              className="ui-btn-secondary"
              onClick={async () => {
                if (!courseId) return;
                saveBlob(await downloadTeacherStudentsCsv(courseId), `course-${courseId}-students.csv`);
              }}
            >
              {t.teacherAnalytics.exportCsv}
            </button>
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
