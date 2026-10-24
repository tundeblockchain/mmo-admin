import { Alert, Button } from '@mui/material';
import { useAccount } from '../../hooks/useAccount';

export const NON_ADMIN_ACCOUNT_MESSAGE =
  'This account is not an admin and cannot publish catalog changes. You can still browse published catalogs.';

export const ACCOUNT_VERIFICATION_ERROR_MESSAGE =
  'Could not verify account permissions. Publishing is disabled until this succeeds. You can still browse published catalogs.';

export function AccountNotice() {
  const account = useAccount();

  if (account.isError) {
    return (
      <Alert
        severity="error"
        role="alert"
        aria-label="Account verification failed"
        sx={{ mb: 2 }}
        action={
          <Button color="inherit" size="small" onClick={account.retry}>
            Retry
          </Button>
        }
      >
        {ACCOUNT_VERIFICATION_ERROR_MESSAGE}
      </Alert>
    );
  }

  if (account.accountType !== null && !account.isAdmin) {
    return (
      <Alert
        severity="warning"
        role="status"
        aria-label="Account is not an admin"
        sx={{ mb: 2 }}
      >
        {NON_ADMIN_ACCOUNT_MESSAGE}
      </Alert>
    );
  }

  return null;
}
