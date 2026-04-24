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
  return data as {
    items: Array<{ id: string; createdAt: string; score: number; exercise: { title: string; lesson?: { title: string } } }>;
  };
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
