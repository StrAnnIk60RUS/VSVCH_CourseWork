export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
}

export interface CourseListItem {
  id: string;
  title: string;
  description: string;
  language: string;
  level: string;
  published: boolean;
  ratingAverage: number | null;
  lessonCount: number;
  enrollmentCount: number;
  reviewCount: number;
  leadTeacher: { id: string; name: string; email: string } | null;
}

export interface CourseDetail {
  id: string;
  title: string;
  description: string;
  language: string;
  level: string;
  published: boolean;
  ratingAverage: number | null;
  leadTeacher: { id: string; name: string; email: string } | null;
  lessons: Array<{ id: string; title: string; order: number; exerciseCount: number }>;
}
