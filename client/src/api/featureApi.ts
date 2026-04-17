import { http } from './http';

export async function enrollToCourse(courseId: string) {
  const { data } = await http.post('/enrollments', { courseId });
  return data;
}

export async function unenrollFromCourse(courseId: string) {
  await http.delete(`/enrollments/${courseId}`);
}

export async function completeLesson(courseId: string, lessonId: string) {
  const { data } = await http.post(`/enrollments/complete-lesson/${courseId}/${lessonId}`);
  return data as { ok: boolean; progress: number };
}

export async function submitExercise(exerciseId: string, answer: string) {
  const { data } = await http.post('/submissions', { exerciseId, answer });
  return data as { correct: boolean; score: number; progress: number };
}

export async function getSubmissions() {
  const { data } = await http.get('/submissions');
  return data as { items: Array<{ id: string; createdAt: string; score: number; exercise: { title: string; lesson?: { title: string } } }> };
}

export async function getEnrollments() {
  const { data } = await http.get('/enrollments');
  return data as {
    items: Array<{
      id: string;
      courseId: string;
      progress: number;
      course: { id: string; title: string; language: string; level: string };
    }>;
  };
}

export async function getFavorites() {
  const { data } = await http.get('/favorites');
  return data as {
    items: Array<{
      id: string;
      courseId: string;
      course: { id: string; title: string; language: string; level: string };
    }>;
  };
}

export async function addFavorite(courseId: string) {
  await http.post('/favorites', { courseId });
}

export async function removeFavorite(courseId: string) {
  await http.delete(`/favorites/${courseId}`);
}

export async function getReminders() {
  const { data } = await http.get('/reminders');
  return data as { items: Array<{ id: string; title: string; remindAt: string }> };
}

export async function createReminder(title: string, remindAt: string) {
  const { data } = await http.post('/reminders', { title, remindAt });
  return data as { id: string; title: string; remindAt: string };
}

export async function updateReminder(id: string, title: string, remindAt: string) {
  const { data } = await http.put(`/reminders/${id}`, { title, remindAt });
  return data as { id: string; title: string; remindAt: string };
}

export async function deleteReminder(id: string) {
  await http.delete(`/reminders/${id}`);
}

export async function getProfile() {
  const { data } = await http.get('/users');
  return data as { id: string; email: string; name: string };
}

export async function updateProfileName(name: string) {
  const { data } = await http.put('/users', { name });
  return data as { id: string; email: string; name: string };
}

export async function getTeacherCourses() {
  const { data } = await http.get('/teacher/courses');
  return data as {
    items: Array<{ id: string; title: string; language: string; level: string; lessonCount: number; enrollmentCount: number }>;
  };
}

export async function createCourse(payload: {
  title: string;
  description: string;
  language: string;
  level: string;
}) {
  const { data } = await http.post('/courses', payload);
  return data as { id: string };
}

export async function getTeacherStudents(courseId: string, params: Record<string, string>) {
  const { data } = await http.get(`/teacher/courses/${courseId}/students`, { params });
  return data as {
    items: Array<{ userId: string; name: string; email: string; progress: number; active: boolean; lastActivity: string }>;
  };
}

export function teacherStudentsCsvUrl(courseId: string) {
  return `${http.defaults.baseURL}/teacher/courses/${courseId}/students.csv`;
}

export async function downloadTeacherStudentsCsv(courseId: string) {
  const response = await http.get(`/teacher/courses/${courseId}/students.csv`, {
    responseType: 'blob',
  });
  return response.data as Blob;
}

export async function getLessonExercises(courseId: string, lessonId: string) {
  const { data } = await http.get(`/courses/${courseId}/lessons/${lessonId}/exercises`);
  return data as { items: Array<{ id: string; title: string; payload?: { question?: string } }> };
}

export async function createLesson(courseId: string, payload: { title: string; content: string }) {
  const { data } = await http.post(`/courses/${courseId}/lessons`, payload);
  return data as { id: string; title: string };
}

export async function deleteLesson(courseId: string, lessonId: string) {
  await http.delete(`/courses/${courseId}/lessons/${lessonId}`);
}

export async function createExercise(
  courseId: string,
  lessonId: string,
  payload: { title: string; question: string; correctAnswer: string; maxScore: number },
) {
  const { data } = await http.post(`/courses/${courseId}/lessons/${lessonId}/exercises`, payload);
  return data as { id: string };
}

export async function deleteExercise(courseId: string, lessonId: string, exerciseId: string) {
  await http.delete(`/courses/${courseId}/lessons/${lessonId}/exercises/${exerciseId}`);
}

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
