import { type ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createAppTheme } from './createAppTheme';
import { useColorScheme } from './useColorScheme';

interface ThemeModeProviderProps {
  children: ReactNode;
}

export function ThemeModeProvider({ children }: ThemeModeProviderProps) {
  const { mode } = useColorScheme();
  const theme = createAppTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
