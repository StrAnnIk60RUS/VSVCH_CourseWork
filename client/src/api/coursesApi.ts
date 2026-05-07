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

export interface UpsertCourseReviewPayload {
  rating: number;
  comment?: string;
}

export interface CourseReviewMine {
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CourseReviewResponse {
  ratingAverage: number | null;
  reviewCount: number;
  myReview: CourseReviewMine;
}

export interface CourseReviewPublicItem {
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string } | null;
}

export async function upsertCourseReview(courseId: string, payload: UpsertCourseReviewPayload) {
  const { data } = await http.post<CourseReviewResponse>(`/courses/${courseId}/review`, payload);
  return data;
}

export async function getMyCourseReview(courseId: string) {
  const { data } = await http.get<{ myReview: CourseReviewMine | null }>(`/courses/${courseId}/review/me`);
  return data;
}

export async function getCourseReviews(courseId: string) {
  const { data } = await http.get<{ items: CourseReviewPublicItem[] }>(`/courses/${courseId}/reviews`);
  return data;
}
