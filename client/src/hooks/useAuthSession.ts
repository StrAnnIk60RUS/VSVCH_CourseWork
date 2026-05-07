import { createContext, useContext } from 'react';
import type { AuthUser } from '../types/domain';

export interface AuthSessionValue {
  user: AuthUser | null;
  authChecked: boolean;
  setAuthenticatedUser: (user: AuthUser | null) => void;
}

export const AuthSessionContext = createContext<AuthSessionValue | null>(null);

export function useAuthSession() {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error('useAuthSession must be used inside AuthSessionContext.Provider');
  }
  return context;
}
