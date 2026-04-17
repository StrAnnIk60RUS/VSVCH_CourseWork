import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { getCurrentUser } from './api';
import { RequireAuth } from './components/auth';
import { AppNav } from './components/layout';
import { STORAGE_KEYS } from './constants/storage';
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
import { useAppDispatch } from './store/hooks';
import { clearSession, setUser } from './store/slices/appSlice';

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.token);
    if (!token) {
      dispatch(clearSession());
      return;
    }
    getCurrentUser()
      .then((user) => dispatch(setUser(user)))
      .catch(() => {
        localStorage.removeItem(STORAGE_KEYS.token);
        dispatch(clearSession());
      });
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route
          path="/courses/:courseId/lessons/:lessonId"
          element={
            <RequireAuth>
              <LessonPage />
            </RequireAuth>
          }
        />
        <Route
          path="/me/learning"
          element={
            <RequireAuth roles={['STUDENT']}>
              <MyLearningPage />
            </RequireAuth>
          }
        />
        <Route
          path="/me/favorites"
          element={
            <RequireAuth>
              <FavoritesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/me/progress"
          element={
            <RequireAuth roles={['STUDENT']}>
              <ProgressPage />
            </RequireAuth>
          }
        />
        <Route
          path="/me/reminders"
          element={
            <RequireAuth>
              <RemindersPage />
            </RequireAuth>
          }
        />
        <Route
          path="/me/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/teacher/courses"
          element={
            <RequireAuth roles={['TEACHER']}>
              <TeacherCoursesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/teacher/courses/new"
          element={
            <RequireAuth roles={['TEACHER']}>
              <TeacherCourseNewPage />
            </RequireAuth>
          }
        />
        <Route
          path="/teacher/courses/:courseId"
          element={
            <RequireAuth roles={['TEACHER']}>
              <TeacherCourseManagePage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
