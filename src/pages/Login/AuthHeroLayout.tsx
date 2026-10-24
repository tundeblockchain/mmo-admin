import { type ReactNode } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { ThemeToggle } from '../../theme';

interface AuthHeroLayoutProps {
  children: ReactNode;
}

export function AuthHeroLayout({ children }: AuthHeroLayoutProps) {
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
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1,
          color: 'navy.contrastText',
        }}
      >
        <ThemeToggle />
      </Box>
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
          {children}
        </Paper>
      </Container>
    </Box>
  );
}
