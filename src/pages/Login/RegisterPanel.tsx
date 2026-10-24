import { type FormEvent, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import {
  AUTH_MESSAGES,
  registerWithEmailPassword,
  toRegisterErrorMessage,
} from '../../auth';
import { isValidEmail, MIN_PASSWORD_LENGTH } from '../../auth/authMessages';
import { provisionRegisteredUser } from '../../auth/registerSession';
import { AuthStatusAlerts } from './AuthStatusAlerts';
import { EmailPasswordFields } from './EmailPasswordFields';
import { AUTH_TEST_IDS } from './authTestIds';

interface RegisterPanelProps {
  onShowSignIn: () => void;
}

export function RegisterPanel({ onShowSignIn }: RegisterPanelProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validate(): string | null {
    if (!isValidEmail(email)) {
      return AUTH_MESSAGES.invalidEmail;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return AUTH_MESSAGES.weakPassword;
    }
    if (password !== confirmPassword) {
      return AUTH_MESSAGES.passwordMismatch;
    }
    return null;
  }

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    registerWithEmailPassword(email.trim(), password)
      .then(async (user) => {
        if (!user) {
          return;
        }
        try {
          await provisionRegisteredUser(user);
        } catch {
          // Verify-email continue refreshes the token and re-POSTs /users/me.
        }
      })
      .catch((err: unknown) => {
        setError(toRegisterErrorMessage(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <Box
      data-testid={AUTH_TEST_IDS.screenRegister}
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="h6" component="h2">
        Create an account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        Register with email and password. You will need to verify your email
        before using the admin panel.
      </Typography>
      <AuthStatusAlerts error={error} />
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <EmailPasswordFields
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          disabled={isLoading}
          showConfirm
          passwordAutoComplete="new-password"
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          data-testid={AUTH_TEST_IDS.submitRegister}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </Box>
      <Button
        type="button"
        variant="text"
        onClick={onShowSignIn}
        disabled={isLoading}
        data-testid={AUTH_TEST_IDS.linkSignIn}
      >
        Already have an account? Sign in
      </Button>
    </Box>
  );
}
