import { type ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../auth';
import { LoginPage } from '../../pages/Login/LoginPage';
import { VerifyEmailPage } from '../../pages/Login/VerifyEmailPage';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const authState = useAuth();

  if (authState.status === 'loading') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        role="status"
        aria-label="Loading authentication"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (authState.status === 'unauthenticated') {
    return <LoginPage />;
  }

  if (!authState.user.emailVerified) {
    return <VerifyEmailPage />;
  }

  return <>{children}</>;
}
