import { http } from './http';
import { STORAGE_KEYS } from '../constants/storage';

export async function enrollToCourse(courseId: string) {
  const { data } = await http.post('/enrollments', { courseId });
  return data;
}

export async function unenrollFromCourse(courseId: string) {
  await http.delete(`/enrollments/${courseId}`);
}

export async function getLessonById(courseId: string, lessonId: string) {
  const { data } = await http.get(`/courses/${courseId}/lessons/${lessonId}`);
  return data as { id: string; title: string; content: string; order: number };
}

export async function submitExercise(exerciseId: string, answer: string) {
  const { data } = await http.post('/submissions', { exerciseId, answer });
  return data as { correct: boolean; score: number; progress: number };
}

/** Одна запись из GET /submissions (соответствует ответу сервера). */
export type SubmissionListItem = {
  id: string;
  exerciseId: string;
  createdAt: string;
  score: number;
  payload?: { answer?: string; correct?: boolean };
  exercise: {
    id?: string;
    title: string;
    lessonId?: string;
    lesson?: { id?: string; title?: string; courseId?: string };
  };
};

export async function getSubmissions() {
  const { data } = await http.get('/submissions');
  return data as { items: SubmissionListItem[] };
}

export type EnrollmentCertificate = {
  id: string;
  documentNumber: string;
  issuedAt: string;
};

export async function getEnrollments() {
  const { data } = await http.get('/enrollments');
  return data as {
    items: Array<{
      id: string;
      courseId: string;
      progress: number;
      course: { id: string; title: string; language: string; level: string };
      certificate: EnrollmentCertificate | null;
    }>;
  };
}

export async function issueCertificate(courseId: string) {
  const { data } = await http.post('/certificates', { courseId });
  return data as EnrollmentCertificate & { enrollmentId: string };
}

export async function getMyCertificates() {
  const { data } = await http.get('/certificates/my');
  return data as {
    items: Array<{
      id: string;
      documentNumber: string;
      issuedAt: string;
      enrollmentId: string;
      course: { id: string; title: string; language: string; level: string } | null;
    }>;
  };
}

export async function downloadCertificatePdf(certificateId: string, documentNumber: string) {
  const uiLanguage = localStorage.getItem(STORAGE_KEYS.uiLanguage) === 'ru' ? 'ru' : 'en';
  const response = await http.get(`/certificates/${certificateId}/pdf`, {
    responseType: 'blob',
    params: { lang: uiLanguage },
    headers: { 'Accept-Language': uiLanguage },
  });
  const blob = response.data as Blob;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `certificate-${documentNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
