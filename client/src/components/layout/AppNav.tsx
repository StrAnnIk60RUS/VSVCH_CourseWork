import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { STORAGE_KEYS } from '../../constants/storage';
import { useI18n } from '../../hooks/useI18n';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearSession, setTheme, setUiLanguage } from '../../store/slices/appSlice';
import { clearSessionStorage } from '../../utils/session';

export function AppNav() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const t = useI18n();
  const user = useAppSelector((s) => s.app.user);
  const theme = useAppSelector((s) => s.app.theme);
  const uiLanguage = useAppSelector((s) => s.app.uiLanguage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainLinks = useMemo(
    () =>
      [
        { to: '/', label: t.nav.home, visible: true },
        { to: '/courses', label: t.nav.courses, visible: true },
        {
          to: '/me/learning',
          label: t.nav.myLearning,
          visible: Boolean(user?.roles.includes('STUDENT')),
        },
        {
          to: '/me/progress',
          label: t.nav.progress,
          visible: Boolean(user?.roles.includes('STUDENT')),
        },
        { to: '/me/reminders', label: t.nav.reminders, visible: Boolean(user) },
        { to: '/teacher/courses', label: t.nav.teacher, visible: Boolean(user?.roles.includes('TEACHER')) },
      ].filter((link) => link.visible),
    [t, user],
  );

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

  const logout = () => {
    clearSessionStorage();
    dispatch(clearSession());
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(nextTheme));
    localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
    document.documentElement.dataset.theme = nextTheme;
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
            {mainLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-ui-muted transition hover:text-ui-link-hover">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden items-center gap-3 text-sm md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded border border-ui-border px-2 py-1 text-ui-text hover:bg-ui-subtle"
          >
            {t.nav.theme}: {theme === 'light' ? t.nav.light : t.nav.dark}
          </button>
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded border border-ui-border px-2 py-1 text-ui-text hover:bg-ui-subtle"
          >
            {t.nav.language}: {uiLanguage.toUpperCase()}
          </button>
          {user ? (
            <>
              <span className="text-ui-text">{user.name}</span>
              <Link to="/me/profile" className="text-ui-muted hover:text-ui-link-hover">
                {t.nav.profile}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded border border-ui-border px-2 py-1 text-ui-text hover:bg-ui-subtle"
              >
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-ui-muted hover:text-ui-link-hover">
                {t.nav.login}
              </Link>
              <Link to="/register" className="text-ui-muted hover:text-ui-link-hover">
                {t.nav.register}
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="rounded border border-ui-border p-2 text-ui-text md:hidden"
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
            className="rounded border border-ui-border px-2 py-1 text-ui-text"
            aria-label={t.nav.closeMenu}
          >
            X
          </button>
        </div>
        <div className="space-y-2 text-sm">
          {mainLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block rounded px-2 py-2 text-ui-text hover:bg-ui-subtle"
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
            className="w-full rounded border border-ui-border px-3 py-2 text-left text-ui-text hover:bg-ui-subtle"
          >
            {t.nav.theme}: {theme === 'light' ? t.nav.light : t.nav.dark}
          </button>
          <button
            type="button"
            onClick={toggleLanguage}
            className="w-full rounded border border-ui-border px-3 py-2 text-left text-ui-text hover:bg-ui-subtle"
          >
            {t.nav.language}: {uiLanguage.toUpperCase()}
          </button>
          {user ? (
            <>
              <p className="px-1 text-ui-muted">{user.name}</p>
              <Link
                to="/me/profile"
                className="block rounded px-2 py-2 text-ui-text hover:bg-ui-subtle"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.profile}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="w-full rounded border border-ui-border px-3 py-2 text-left text-ui-text hover:bg-ui-subtle"
              >
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block rounded px-2 py-2 text-ui-text hover:bg-ui-subtle"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.login}
              </Link>
              <Link
                to="/register"
                className="block rounded px-2 py-2 text-ui-text hover:bg-ui-subtle"
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
