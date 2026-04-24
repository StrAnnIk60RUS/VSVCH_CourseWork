import { http } from './http';

export async function downloadReport(
  type: 'student-progress' | 'course-summary',
  format: 'pdf' | 'docx',
  courseId?: string,
) {
  const path =
    type === 'student-progress'
      ? `/reports/student-progress.${format}`
      : `/reports/course-summary.${format}?courseId=${courseId ?? ''}`;
  const response = await http.get(path, { responseType: 'blob' });
  return response.data as Blob;
}

export async function sendReportEmail(input: {
  email: string;
  type: 'student-progress' | 'course-summary';
  format: 'pdf' | 'docx';
  courseId?: string;
}) {
  const { data } = await http.post('/reports/send-email', input);
  return data as { sent?: boolean; demo?: boolean; message?: string };
}
