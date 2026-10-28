import { Box, Button, Typography } from '@mui/material';
import { signOutUser } from '../../auth';
import { ACCOUNT_MESSAGES } from '../../components/account/accountMessages';
import { AuthHeroLayout } from '../Login/AuthHeroLayout';
import { AUTH_TEST_IDS } from '../Login/authTestIds';

interface AccountRetryPageProps {
  onRetry: () => void;
}

export function AccountRetryPage({ onRetry }: AccountRetryPageProps) {
  function handleSignOut() {
    signOutUser().catch(() => {
      // Returning to login is handled by the auth gate.
    });
  }

  return (
    <AuthHeroLayout>
      <Box
        data-testid={AUTH_TEST_IDS.screenAccountRetry}
        role="alert"
        aria-label={ACCOUNT_MESSAGES.retryTitle}
        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography variant="h6" component="h2">
          {ACCOUNT_MESSAGES.retryTitle}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          {ACCOUNT_MESSAGES.retryBody}
        </Typography>
        <Button
          type="button"
          variant="contained"
          size="large"
          onClick={onRetry}
          data-testid={AUTH_TEST_IDS.retryAccount}
        >
          {ACCOUNT_MESSAGES.retryAction}
        </Button>
        <Button
          type="button"
          variant="text"
          onClick={handleSignOut}
          data-testid={AUTH_TEST_IDS.signOut}
        >
          Sign out
        </Button>
      </Box>
    </AuthHeroLayout>
  );
}
