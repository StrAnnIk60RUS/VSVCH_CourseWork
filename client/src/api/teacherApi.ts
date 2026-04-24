import { http } from './http';

export async function getTeacherCourses() {
  const { data } = await http.get('/teacher/courses');
  return data as {
    items: Array<{ id: string; title: string; language: string; level: string; lessonCount: number; enrollmentCount: number }>;
  };
}

export async function getTeacherCourseById(courseId: string) {
  const { data } = await http.get(`/teacher/courses/${courseId}`);
  return data as {
    id: string;
    title: string;
    description: string;
    language: string;
    level: string;
    lessons: Array<{ id: string; title: string; content?: string; order?: number }>;
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

export async function updateCourse(
  courseId: string,
  payload: Partial<{
    title: string;
    description: string;
    language: string;
    level: string;
    published: boolean;
  }>,
) {
  const { data } = await http.put(`/courses/${courseId}`, payload);
  return data as {
    id: string;
    title: string;
    description: string;
    language: string;
    level: string;
    published: boolean;
  };
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

export async function createLesson(courseId: string, payload: { title: string; content: string }) {
  const { data } = await http.post(`/courses/${courseId}/lessons`, payload);
  return data as { id: string; title: string };
}

export async function deleteLesson(courseId: string, lessonId: string) {
  await http.delete(`/courses/${courseId}/lessons/${lessonId}`);
}

export async function updateLesson(
  courseId: string,
  lessonId: string,
  payload: { title?: string; content?: string; order?: number },
) {
  const { data } = await http.put(`/courses/${courseId}/lessons/${lessonId}`, payload);
  return data as { id: string; title: string; content?: string; order?: number };
}

export async function getLessonExercises(courseId: string, lessonId: string) {
  const { data } = await http.get(`/courses/${courseId}/lessons/${lessonId}/exercises`);
  return data as {
    items: Array<{
      id: string;
      title: string;
      type: string;
      question?: string;
      correctAnswer?: string | number | boolean;
      maxScore?: number;
      payload?: { question?: string; correctAnswer?: string; maxScore?: number };
    }>;
  };
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

export async function updateExercise(
  courseId: string,
  lessonId: string,
  exerciseId: string,
  payload: Partial<{ title: string; question: string; correctAnswer: string; maxScore: number }>,
) {
  const { data } = await http.put(`/courses/${courseId}/lessons/${lessonId}/exercises/${exerciseId}`, payload);
  return data as { id: string; title: string; question?: string; correctAnswer?: string; maxScore?: number };
}
