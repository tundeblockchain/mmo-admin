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
      sx={(theme) => ({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `linear-gradient(155deg, ${theme.palette.hero.from} 0%, ${theme.palette.hero.mid} 46%, ${theme.palette.hero.to} 100%)`,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 420,
          height: 420,
          borderRadius: '50%',
          right: -80,
          top: -90,
          backgroundColor: theme.palette.hero.glow,
          filter: 'blur(12px)',
        },
      })}
    >
      <Container maxWidth="sm" sx={{ position: 'relative' }}>
        <Paper
          sx={(theme) => ({
            p: { xs: 4, sm: 5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            backgroundColor: theme.palette.hero.glass,
            borderColor: theme.palette.hero.glassBorder,
            backdropFilter: 'blur(18px)',
            boxShadow: theme.shadows[8],
          })}
        >
          <Box
            aria-hidden
            sx={(theme) => ({
              width: 56,
              height: 56,
              borderRadius: 2,
              backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
              boxShadow: theme.shadows[4],
            })}
          />
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
            sx={{ mt: 1 }}
          >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
