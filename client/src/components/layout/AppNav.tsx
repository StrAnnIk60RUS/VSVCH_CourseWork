import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { STORAGE_KEYS, clearUiStorage } from '../../constants/storage';
import { useAuthSession } from '../../hooks/useAuthSession';
import { useI18n } from '../../hooks/useI18n';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearSession, setTheme, setUiLanguage } from '../../store/slices/appSlice';
import { clearSessionStorage } from '../../utils/session';

export function AppNav() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const t = useI18n();
  const { user, setAuthenticatedUser } = useAuthSession();
  const theme = useAppSelector((s) => s.app.theme);
  const uiLanguage = useAppSelector((s) => s.app.uiLanguage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const isStudent = Boolean(user?.roles.includes('STUDENT'));
  const isTeacher = Boolean(user?.roles.includes('TEACHER'));

  const desktopMainLinks = useMemo(
    () =>
      [
        { to: '/', label: t.nav.home, visible: true },
        { to: isTeacher ? '/teacher/courses' : '/courses', label: t.nav.courses, visible: true },
        { to: '/me/reminders', label: t.nav.reminders, visible: Boolean(user) && !isStudent },
        { to: '/teacher/analytics', label: t.nav.analytics, visible: isTeacher },
      ].filter((link) => link.visible),
    [isStudent, isTeacher, t, user],
  );

  const learningLinks = useMemo(
    () =>
      [
        { to: '/me/learning', label: t.nav.currentCourses, visible: isStudent },
        { to: '/me/favorites', label: t.nav.favorites, visible: isStudent },
        { to: '/me/progress', label: t.nav.progress, visible: isStudent },
        { to: '/me/reminders', label: t.nav.reminders, visible: isStudent },
      ].filter((link) => link.visible),
    [isStudent, t],
  );

  const mobileMainLinks = useMemo(
    () =>
      [
        ...desktopMainLinks,
        ...learningLinks,
      ].filter((link, index, arr) => arr.findIndex((item) => item.to === link.to) === index),
    [desktopMainLinks, learningLinks],
  );

  const isLinkActive = (to: string) => {
    if (to === '/') {
      return location.pathname === '/';
    }
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };
  const isLearningSectionActive = learningLinks.some((link) => isLinkActive(link.to));

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.removeProperty('overflow');
      return;
    }
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.removeProperty('overflow');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!settingsOpen) {
      return;
    }
    const onPointerDown = (event: MouseEvent) => {
      if (!settingsRef.current?.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSettingsOpen(false);
      }
    };
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [settingsOpen]);

  const logout = () => {
    clearSessionStorage();
    setAuthenticatedUser(null);
    dispatch(clearSession());
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(nextTheme));
    localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  };

  const resetUiSettings = () => {
    clearUiStorage();
    dispatch(setTheme('light'));
    dispatch(setUiLanguage('ru'));
    document.documentElement.dataset.theme = 'light';
    document.documentElement.lang = 'ru';
    setSettingsOpen(false);
  };

  const toggleLanguage = () => {
    const nextLanguage = uiLanguage === 'ru' ? 'en' : 'ru';
    dispatch(setUiLanguage(nextLanguage));
    localStorage.setItem(STORAGE_KEYS.uiLanguage, nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  return (
    <nav className="border-b border-ui-border bg-ui-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-ui-text">{t.common.appName}</span>
          <div className="hidden items-center gap-3 text-sm md:flex">
            {desktopMainLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`ui-link-anim ${
                  isLinkActive(link.to) ? 'is-active text-ui-link font-semibold' : 'text-ui-muted'
                }`}
                aria-current={isLinkActive(link.to) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            {learningLinks.length > 0 && (
              <div className="group relative">
                <span
                  className={`ui-link-anim inline-flex cursor-pointer items-center gap-1 ${
                    isLearningSectionActive ? 'is-active text-ui-link font-semibold' : 'text-ui-muted'
                  }`}
                  tabIndex={0}
                >
                  {t.nav.myLearning}
                  <span
                    className="text-xs transition-transform duration-150 group-hover:rotate-180 group-focus-within:rotate-180"
                    aria-hidden="true"
                  >
                    v
                  </span>
                </span>
                <div className="pointer-events-none invisible absolute left-0 top-full z-30 w-64 pt-2 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100">
                  <div className="rounded border border-ui-border bg-ui-surface p-2 shadow-lg">
                    {learningLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`ui-menu-action mt-1 block first:mt-0 ${
                          isLinkActive(link.to)
                            ? 'border-[var(--ui-link)] bg-ui-subtle text-ui-link font-semibold'
                            : ''
                        }`}
                        aria-current={isLinkActive(link.to) ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="hidden items-center gap-3 text-sm md:flex">
          {user ? (
            <>
              <Link
                to="/me/profile"
                className={`ui-link-anim ${isLinkActive('/me/profile') ? 'is-active text-ui-link font-semibold' : 'text-ui-text'}`}
                aria-current={isLinkActive('/me/profile') ? 'page' : undefined}
              >
                {user.name}
              </Link>
              <div className="relative" ref={settingsRef}>
                <button
                  type="button"
                  onClick={() => setSettingsOpen((prev) => !prev)}
                  className="ui-btn-secondary text-sm"
                  aria-haspopup="menu"
                  aria-expanded={settingsOpen}
                >
                  {t.nav.settings}
                </button>
                {settingsOpen && (
                  <div className="absolute right-0 z-30 mt-2 w-64 rounded border border-ui-border bg-ui-surface p-2 shadow-lg">
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="ui-menu-action"
                    >
                      {t.nav.theme}: {theme === 'light' ? t.nav.light : t.nav.dark}
                    </button>
                    <button
                      type="button"
                      onClick={toggleLanguage}
                      className="ui-menu-action mt-1"
                    >
                      {t.nav.language}: {uiLanguage.toUpperCase()}
                    </button>
                    <button
                      type="button"
                      onClick={resetUiSettings}
                      className="ui-menu-action mt-1"
                    >
                      {t.profile.resetButton}
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={logout}
                className="ui-btn-secondary text-sm"
              >
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`ui-link-anim ${isLinkActive('/login') ? 'is-active text-ui-link font-semibold' : 'text-ui-muted'}`}
                aria-current={isLinkActive('/login') ? 'page' : undefined}
              >
                {t.nav.login}
              </Link>
              <Link
                to="/register"
                className={`ui-link-anim ${isLinkActive('/register') ? 'is-active text-ui-link font-semibold' : 'text-ui-muted'}`}
                aria-current={isLinkActive('/register') ? 'page' : undefined}
              >
                {t.nav.register}
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="ui-icon-btn md:!hidden"
          aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-drawer"
        >
          {mobileMenuOpen ? 'X' : '='}
        </button>
      </div>
      {mobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-label={t.nav.closeMenu}
        />
      )}
      <aside
        id="mobile-nav-drawer"
        className={`fixed right-0 top-0 z-50 h-dvh w-72 max-w-[85vw] border-l border-ui-border bg-ui-surface p-4 shadow-lg transition-transform md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="font-semibold text-ui-text">{t.common.appName}</span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="ui-icon-btn"
            aria-label={t.nav.closeMenu}
          >
            X
          </button>
        </div>
        <div className="space-y-2 text-sm">
          {mobileMainLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`ui-menu-action block ${
                isLinkActive(link.to) ? 'border-[var(--ui-link)] bg-ui-subtle text-ui-link font-semibold' : ''
              }`}
              aria-current={isLinkActive(link.to) ? 'page' : undefined}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-ui-border pt-4 text-sm">
          <button
            type="button"
            onClick={toggleTheme}
            className="ui-menu-action"
          >
            {t.nav.theme}: {theme === 'light' ? t.nav.light : t.nav.dark}
          </button>
          <button
            type="button"
            onClick={toggleLanguage}
            className="ui-menu-action"
          >
            {t.nav.language}: {uiLanguage.toUpperCase()}
          </button>
          {user ? (
            <>
              <p className="px-1 text-ui-muted">{user.name}</p>
              <Link
                to="/me/profile"
                className={`ui-menu-action block ${
                  isLinkActive('/me/profile') ? 'border-[var(--ui-link)] bg-ui-subtle text-ui-link font-semibold' : ''
                }`}
                aria-current={isLinkActive('/me/profile') ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.profile}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="ui-menu-action"
              >
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`ui-menu-action block ${
                  isLinkActive('/login') ? 'border-[var(--ui-link)] bg-ui-subtle text-ui-link font-semibold' : ''
                }`}
                aria-current={isLinkActive('/login') ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.login}
              </Link>
              <Link
                to="/register"
                className={`ui-menu-action block ${
                  isLinkActive('/register') ? 'border-[var(--ui-link)] bg-ui-subtle text-ui-link font-semibold' : ''
                }`}
                aria-current={isLinkActive('/register') ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.register}
              </Link>
            </>
          )}
        </div>
      </aside>
    </nav>
  );
}
