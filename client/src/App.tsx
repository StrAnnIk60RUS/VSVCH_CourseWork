import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  CourseDetailPage,
  CoursesPage,
  FavoritesPage,
  HomePage,
  LessonPage,
  LoginPage,
  MyLearningPage,
  ProfilePage,
  ProgressPage,
  RegisterPage,
  RemindersPage,
  TeacherCourseManagePage,
  TeacherCourseNewPage,
  TeacherCoursesPage,
} from './pages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
        <Route path="/me/learning" element={<MyLearningPage />} />
        <Route path="/me/favorites" element={<FavoritesPage />} />
        <Route path="/me/progress" element={<ProgressPage />} />
        <Route path="/me/reminders" element={<RemindersPage />} />
        <Route path="/me/profile" element={<ProfilePage />} />
        <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
        <Route path="/teacher/courses/new" element={<TeacherCourseNewPage />} />
        <Route path="/teacher/courses/:courseId" element={<TeacherCourseManagePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
