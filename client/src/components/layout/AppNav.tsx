import { Link } from 'react-router-dom';
import { clearAppStorage, STORAGE_KEYS } from '../../constants/storage';
import { clearSession } from '../../store/slices/appSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export function AppNav() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.app.user);

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    clearAppStorage();
    dispatch(clearSession());
  };

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link to="/">Home</Link>
          <Link to="/courses">Courses</Link>
          {user && <Link to="/me/learning">My learning</Link>}
          {user && <Link to="/me/progress">Progress</Link>}
          {user && <Link to="/me/reminders">Reminders</Link>}
          {user?.roles.includes('TEACHER') && <Link to="/teacher/courses">Teacher</Link>}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span>{user.name}</span>
              <Link to="/me/profile">Profile</Link>
              <button
                type="button"
                onClick={logout}
                className="rounded border border-slate-300 px-2 py-1 hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
