import { type ReactNode } from 'react';
import { useAuth } from '../../auth';
import { LoginPage } from '../../pages/Login/LoginPage';
import { VerifyEmailPage } from '../../pages/Login/VerifyEmailPage';
import { FullPageSpinner } from '../common/FullPageSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const authState = useAuth();

  if (authState.status === 'loading') {
    return <FullPageSpinner label="Loading authentication" />;
  }

  if (authState.status === 'unauthenticated') {
    return <LoginPage />;
  }

  if (!authState.user.emailVerified) {
    return <VerifyEmailPage />;
  }

  return <>{children}</>;
}
