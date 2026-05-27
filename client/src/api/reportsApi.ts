import { http } from './http';
import { STORAGE_KEYS } from '../constants/storage';

type UiLanguage = 'ru' | 'en';

function getCurrentUiLanguage(): UiLanguage {
  const raw = localStorage.getItem(STORAGE_KEYS.uiLanguage);
  return raw === 'ru' ? 'ru' : 'en';
}

export async function downloadReport(
  type: 'student-progress' | 'course-summary',
  format: 'pdf' | 'docx',
  courseId?: string,
) {
  const uiLanguage = getCurrentUiLanguage();
  const path =
    type === 'student-progress' ? `/reports/student-progress.${format}` : `/reports/course-summary.${format}`;
  const response = await http.get(path, {
    responseType: 'blob',
    headers: { 'Accept-Language': uiLanguage },
    params: type === 'course-summary' ? { courseId: courseId ?? '', lang: uiLanguage } : { lang: uiLanguage },
  });
  return response.data as Blob;
}

export async function sendReportEmail(input: {
  email?: string;
  type: 'student-progress' | 'course-summary';
  format: 'pdf' | 'docx';
  courseId?: string;
}) {
  const uiLanguage = getCurrentUiLanguage();
  const normalizedEmail = input.email?.trim();
  const { data } = await http.post(
    '/reports/send-email',
    { ...input, email: normalizedEmail || undefined, lang: uiLanguage },
    { headers: { 'Accept-Language': uiLanguage } },
  );
  return data as { sent?: boolean; demo?: boolean; message?: string };
}

export type TeacherAnalyticsResponse = {
  course: { id: string; title: string; language: string; level: string };
  periodDays: number;
  kpis: {
    students: number;
    avgProgress: number;
    activeStudents7d: number;
    riskStudents: number;
  };
  progressBuckets: {
    p0_25: number;
    p26_50: number;
    p51_75: number;
    p76_100: number;
  };
  students: Array<{
    userId: string;
    name: string;
    email: string;
    progress: number;
    lastActivity: string;
    inactiveDays: number;
  }>;
  timeline: Array<{ date: string; submissions: number; activeStudents: number }>;
};

export async function getTeacherAnalytics(courseId: string, periodDays: 7 | 30 | 90) {
  const { data } = await http.get('/reports/teacher-analytics', {
    params: { courseId, periodDays },
  });
  return data as TeacherAnalyticsResponse;
}
