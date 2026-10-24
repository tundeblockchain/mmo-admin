import { type FormEvent, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { AUTH_MESSAGES, sendPasswordReset } from '../../auth';
import { isValidEmail } from '../../auth/authMessages';
import { AuthStatusAlerts } from './AuthStatusAlerts';
import { AUTH_TEST_IDS } from './authTestIds';

interface ForgotPasswordPanelProps {
  onShowSignIn: () => void;
}

export function ForgotPasswordPanel({ onShowSignIn }: ForgotPasswordPanelProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError(AUTH_MESSAGES.invalidEmail);
      setSuccess(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    sendPasswordReset(email.trim())
      .catch(() => undefined)
      .finally(() => {
        setSuccess(AUTH_MESSAGES.resetSent);
        setIsLoading(false);
      });
  }

  return (
    <Box
      data-testid={AUTH_TEST_IDS.screenForgotPassword}
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="h6" component="h2">
        Reset password
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        Enter your email and we will send a reset link if an account exists.
      </Typography>
      <AuthStatusAlerts error={error} success={success} />
      <Box
        component="form"
        onSubmit={handleReset}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          id="auth-email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          fullWidth
          value={email}
          disabled={isLoading}
          onChange={(event) => setEmail(event.target.value)}
          slotProps={{ htmlInput: { 'data-testid': AUTH_TEST_IDS.email } }}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          data-testid={AUTH_TEST_IDS.submitForgotPassword}
        >
          {isLoading ? 'Sending...' : 'Send reset link'}
        </Button>
      </Box>
      <Button
        type="button"
        variant="text"
        onClick={onShowSignIn}
        disabled={isLoading}
        data-testid={AUTH_TEST_IDS.linkSignIn}
      >
        Back to sign in
      </Button>
    </Box>
  );
}
