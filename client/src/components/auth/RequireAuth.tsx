import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import type { UserRole } from '../../types/domain';

interface RequireAuthProps {
  children: ReactElement;
  roles?: UserRole[];
}

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const { user, authChecked } = useAppSelector((s) => s.app);

  if (!authChecked) {
    return <div className="p-8 text-sm text-slate-600">Loading session...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.some((role) => user.roles.includes(role))) {
    return <Navigate to="/" replace />;
  }
  return children;
}
