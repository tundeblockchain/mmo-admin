import { useState, type FormEvent } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  TextField,
  Divider,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithEmailPassword, signInWithGoogle } from '../../auth';

type SignInMethod = 'google' | 'email';

export function LoginPage() {
  const [pendingMethod, setPendingMethod] = useState<SignInMethod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLoading = pendingMethod !== null;

  function handleAuthError(err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to sign in';
    setError(message);
  }

  function handleGoogleSignIn() {
    setPendingMethod('google');
    setError(null);
    void signInWithGoogle()
      .catch(handleAuthError)
      .finally(() => {
        setPendingMethod(null);
      });
  }

  function handleEmailSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendingMethod('email');
    setError(null);
    void signInWithEmailPassword(email, password)
      .catch(handleAuthError)
      .finally(() => {
        setPendingMethod(null);
      });
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            MMO Admin
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            Sign in with your Google account to access the admin panel.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            startIcon={
              pendingMethod === 'google' ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <GoogleIcon />
              )
            }
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {pendingMethod === 'google' ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          <Divider sx={{ width: '100%' }}>or</Divider>

          <Box
            component="form"
            onSubmit={handleEmailSignIn}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              label="Email"
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoading}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="outlined"
              size="large"
              disabled={isLoading}
              startIcon={
                pendingMethod === 'email' ? (
                  <CircularProgress size={20} color="inherit" />
                ) : undefined
              }
            >
              {pendingMethod === 'email' ? 'Signing in...' : 'Sign in with email'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
