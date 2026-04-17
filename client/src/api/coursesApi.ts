import { http } from './http';
import type { CourseDetail, CourseListItem } from '../types/domain';

export interface CourseListResponse {
  items: CourseListItem[];
  total: number;
  page: number;
  limit: number;
}

export async function getCourses(params: Record<string, string | number | undefined>) {
  const { data } = await http.get<CourseListResponse>('/courses', { params });
  return data;
}

export async function getCourseById(courseId: string) {
  const { data } = await http.get<CourseDetail>(`/courses/${courseId}`);
  return data;
}
