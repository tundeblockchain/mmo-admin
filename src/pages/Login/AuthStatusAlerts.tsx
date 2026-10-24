import { Alert } from '@mui/material';
import { AUTH_TEST_IDS } from './authTestIds';

interface AuthStatusAlertsProps {
  error: string | null;
  success?: string | null;
}

export function AuthStatusAlerts({ error, success = null }: AuthStatusAlertsProps) {
  return (
    <>
      {error ? (
        <Alert severity="error" sx={{ width: '100%' }} data-testid={AUTH_TEST_IDS.error}>
          {error}
        </Alert>
      ) : null}
      {success ? (
        <Alert
          severity="success"
          sx={{ width: '100%' }}
          data-testid={AUTH_TEST_IDS.success}
        >
          {success}
        </Alert>
      ) : null}
    </>
  );
}
