import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { deleteReminder, getCurrentUser, getReminders } from './api';
import { RequireAuth } from './components/auth';
import { AppFooter, AppNav } from './components/layout';
import { useI18n } from './hooks/useI18n';
import { AuthSessionContext } from './hooks/useAuthSession';
import { ToastProvider, ToastViewport } from './hooks/useToast';
import { STORAGE_KEYS } from './constants/storage';
import {
  CourseDetailPage,
  CourseReviewsPage,
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
  TeacherAnalyticsPage,
  TeacherCoursesPage,
} from './pages';
import { useAppDispatch } from './store/hooks';
import { clearSession, setAuthChecked, setTheme, setUiLanguage } from './store/slices/appSlice';
import type { AuthUser } from './types/domain';
import { formatDateTime } from './utils/dateTime';
import { readAccessToken } from './utils/session';

function AppChrome() {
  return (
    <div className="flex min-h-dvh flex-col bg-ui-bg">
      <AppNav />
      <div className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
      <AppFooter />
    </div>
  );
}

export default function App() {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthCheckedState] = useState(false);
  const t = useI18n();
  const isTeacher = Boolean(user?.roles.includes('TEACHER'));
  const [dueNotifications, setDueNotifications] = useState<Array<{ id: string; title: string; remindAt: string }>>(
    [],
  );
  const notifiedReminderIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    const theme = savedTheme === 'dark' ? 'dark' : 'light';
    dispatch(setTheme(theme));
    document.documentElement.dataset.theme = theme;
  }, [dispatch]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.uiLanguage);
    const detected = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'ru';
    const language = savedLanguage === 'en' || savedLanguage === 'ru' ? savedLanguage : detected;
    dispatch(setUiLanguage(language));
    document.documentElement.lang = language;
  }, [dispatch]);

  const setAuthenticatedUser = useCallback(
    (nextUser: AuthUser | null) => {
      setUser(nextUser);
      setAuthCheckedState(true);
      dispatch(setAuthChecked(true));
    },
    [dispatch],
  );

  useEffect(() => {
    const token = readAccessToken();
    if (!token) {
      setAuthenticatedUser(null);
      return;
    }
    getCurrentUser()
      .then((nextUser) => {
        setAuthenticatedUser(nextUser);
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEYS.token);
        setUser(null);
        setAuthCheckedState(true);
        dispatch(clearSession());
      });
  }, [dispatch, setAuthenticatedUser]);

  useEffect(() => {
    let isMounted = true;
    const pollDueReminders = async () => {
      if (!readAccessToken()) {
        return;
      }
      try {
        const response = await getReminders();
        if (!isMounted) {
          return;
        }
        const now = Date.now();
        const newlyDue = response.items.filter((item) => {
          if (notifiedReminderIdsRef.current.has(item.id)) {
            return false;
          }
          return new Date(item.remindAt).getTime() <= now;
        });

        if (!newlyDue.length) {
          return;
        }

        newlyDue.forEach((item) => notifiedReminderIdsRef.current.add(item.id));
        setDueNotifications((prev) => [...prev, ...newlyDue]);
      } catch {
        // Silently ignore polling errors to avoid breaking app UX.
      }
    };

    void pollDueReminders();
    const intervalId = window.setInterval(() => {
      void pollDueReminders();
    }, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const dismissNotification = async (id: string) => {
    try {
      await deleteReminder(id);
      notifiedReminderIdsRef.current.delete(id);
      setDueNotifications((prev) => prev.filter((item) => item.id !== id));
    } catch {
      // Ignore deletion errors here to avoid noisy UX in global app shell.
    }
  };

  const authContextValue = useMemo(
    () => ({
      user,
      authChecked,
      setAuthenticatedUser,
    }),
    [authChecked, setAuthenticatedUser, user],
  );

  return (
    <AuthSessionContext.Provider value={authContextValue}>
      <ToastProvider>
        <BrowserRouter>
        <ToastViewport />
        {dueNotifications.length > 0 ? (
          <div className="pointer-events-none fixed left-4 top-4 z-50 space-y-2">
            {dueNotifications.map((item) => (
              <div
                key={item.id}
                className="ui-notice pointer-events-auto max-w-sm shadow-lg"
                role="status"
              >
                <p className="text-sm font-semibold">⏰ {t.app.reminderTitle}</p>
                <p className="mt-1 text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs opacity-85">{formatDateTime(item.remindAt)}</p>
                <button
                  type="button"
                  onClick={() => {
                    void dismissNotification(item.id);
                  }}
                  className="ui-btn-secondary mt-2 px-2 py-1 text-xs"
                >
                  {t.app.close}
                </button>
              </div>
            ))}
          </div>
        ) : null}
        <Routes>
        <Route element={<AppChrome />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/courses"
            element={isTeacher ? <Navigate to="/teacher/courses" replace /> : <CoursesPage />}
          />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/courses/:courseId/reviews" element={<CourseReviewsPage />} />
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
            path="/teacher/analytics"
            element={
              <RequireAuth roles={['TEACHER']}>
                <TeacherAnalyticsPage />
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
        </Route>
        </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthSessionContext.Provider>
  );
}
