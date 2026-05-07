import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { useAuthSession } from '../../hooks/useAuthSession';
import type { UserRole } from '../../types/domain';

interface RequireAuthProps {
  children: ReactElement;
  roles?: UserRole[];
}

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const t = useI18n();
  const { user, authChecked } = useAuthSession();

  if (!authChecked) {
    return <div className="p-8 text-sm text-ui-muted">{t.auth.loadingSession}</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.some((role) => user.roles.includes(role))) {
    return <Navigate to="/" replace />;
  }
  return children;
}
