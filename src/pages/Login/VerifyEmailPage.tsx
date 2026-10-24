import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import {
  AUTH_MESSAGES,
  resendVerificationEmail,
  signOutUser,
  toVerifyErrorMessage,
} from '../../auth';
import { confirmEmailVerified } from '../../auth/verifyEmailSession';
import { AuthHeroLayout } from './AuthHeroLayout';
import { AuthStatusAlerts } from './AuthStatusAlerts';
import { AUTH_TEST_IDS } from './authTestIds';

export function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const isBusy = isResending || isContinuing;

  function handleResend() {
    setIsResending(true);
    setError(null);
    setSuccess(null);
    resendVerificationEmail()
      .then(() => {
        setSuccess(AUTH_MESSAGES.verifyResent);
      })
      .catch((err: unknown) => {
        setError(toVerifyErrorMessage(err));
      })
      .finally(() => {
        setIsResending(false);
      });
  }

  function handleContinue() {
    setIsContinuing(true);
    setError(null);
    setSuccess(null);
    confirmEmailVerified()
      .catch((err: unknown) => {
        setError(
          err instanceof Error && err.message === AUTH_MESSAGES.stillUnverified
            ? AUTH_MESSAGES.stillUnverified
            : AUTH_MESSAGES.continueFailed,
        );
      })
      .finally(() => {
        setIsContinuing(false);
      });
  }

  function handleSignOut() {
    signOutUser().catch(() => {
      setError(AUTH_MESSAGES.genericSignIn);
    });
  }

  return (
    <AuthHeroLayout>
      <Box
        data-testid={AUTH_TEST_IDS.screenVerifyEmail}
        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography variant="h6" component="h2">
          {AUTH_MESSAGES.verifyTitle}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          {AUTH_MESSAGES.verifyBody}
        </Typography>
        <AuthStatusAlerts error={error} success={success} />
        <Button
          type="button"
          variant="contained"
          size="large"
          onClick={handleContinue}
          disabled={isBusy}
          data-testid={AUTH_TEST_IDS.continueVerified}
        >
          {isContinuing ? 'Checking...' : "I've verified my email"}
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={handleResend}
          disabled={isBusy}
          data-testid={AUTH_TEST_IDS.resendVerification}
        >
          {isResending ? 'Sending...' : 'Resend verification email'}
        </Button>
        <Button
          type="button"
          variant="text"
          onClick={handleSignOut}
          disabled={isBusy}
          data-testid={AUTH_TEST_IDS.signOut}
        >
          Sign out
        </Button>
      </Box>
    </AuthHeroLayout>
  );
}
