import { Box, Button, Typography } from '@mui/material';
import { signOutUser, useAuth } from '../../auth';
import { ACCOUNT_MESSAGES } from '../../components/account/accountMessages';
import { AuthHeroLayout } from '../Login/AuthHeroLayout';
import { AUTH_TEST_IDS } from '../Login/authTestIds';

export function NotAnAdminPage() {
  const authState = useAuth();
  const email =
    authState.status === 'authenticated' ? authState.user.email : null;

  function handleSignOut() {
    signOutUser().catch(() => {
      // Returning to login is handled by the auth gate.
    });
  }

  return (
    <AuthHeroLayout>
      <Box
        data-testid={AUTH_TEST_IDS.screenNotAdmin}
        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography variant="h6" component="h2">
          {ACCOUNT_MESSAGES.notAdminTitle}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          {ACCOUNT_MESSAGES.notAdminBody}
        </Typography>
        {email ? (
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            Signed in as {email}
          </Typography>
        ) : null}
        <Button
          type="button"
          variant="contained"
          size="large"
          onClick={handleSignOut}
          data-testid={AUTH_TEST_IDS.signOut}
        >
          Sign out
        </Button>
      </Box>
    </AuthHeroLayout>
  );
}
