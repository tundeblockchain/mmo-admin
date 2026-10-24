import { type FormEvent, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import {
  signInWithEmailPassword,
  signInWithGoogle,
  toSignInErrorMessage,
} from '../../auth';
import { AuthStatusAlerts } from './AuthStatusAlerts';
import { EmailPasswordFields } from './EmailPasswordFields';
import { AUTH_TEST_IDS } from './authTestIds';

interface SignInPanelProps {
  onShowRegister: () => void;
  onShowForgotPassword: () => void;
}

export function SignInPanel({
  onShowRegister,
  onShowForgotPassword,
}: SignInPanelProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoading = isGoogleLoading || isEmailLoading;

  function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    setError(null);
    signInWithGoogle()
      .catch((err: unknown) => {
        setError(toSignInErrorMessage(err));
      })
      .finally(() => {
        setIsGoogleLoading(false);
      });
  }

  function handleEmailSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsEmailLoading(true);
    setError(null);
    signInWithEmailPassword(email.trim(), password)
      .catch((err: unknown) => {
        setError(toSignInErrorMessage(err));
      })
      .finally(() => {
        setIsEmailLoading(false);
      });
  }

  return (
    <Box
      data-testid={AUTH_TEST_IDS.screenSignIn}
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
        Sign in with email or Google to access the admin panel.
      </Typography>
      <AuthStatusAlerts error={error} />
      <Box
        component="form"
        onSubmit={handleEmailSignIn}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <EmailPasswordFields
          email={email}
          password={password}
          disabled={isLoading}
          passwordAutoComplete="current-password"
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          data-testid={AUTH_TEST_IDS.submitSignIn}
        >
          {isEmailLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </Box>
      <Button
        type="button"
        variant="text"
        onClick={onShowForgotPassword}
        disabled={isLoading}
        data-testid={AUTH_TEST_IDS.linkForgotPassword}
      >
        Forgot password
      </Button>
      <Divider>or</Divider>
      <Button
        type="button"
        variant="contained"
        size="large"
        startIcon={
          isGoogleLoading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />
        }
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        data-testid={AUTH_TEST_IDS.google}
      >
        {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
      </Button>
      <Button
        type="button"
        variant="text"
        onClick={onShowRegister}
        disabled={isLoading}
        data-testid={AUTH_TEST_IDS.linkRegister}
      >
        Create an account
      </Button>
    </Box>
  );
}
