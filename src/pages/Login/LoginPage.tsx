import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithGoogle } from '../../auth';

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSignIn() {
    setIsLoading(true);
    setError(null);
    signInWithGoogle()
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to sign in';
        setError(message);
      })
      .finally(() => {
        setIsLoading(false);
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
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <GoogleIcon />
              )
            }
            onClick={handleSignIn}
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
