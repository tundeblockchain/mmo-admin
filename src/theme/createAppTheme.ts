import { createTheme } from '@mui/material/styles';
import { colors, schemeColors, type ThemeMode } from './colors';
import { componentOverrides } from './componentOverrides';
import './palette.types';

const fontFamily = [
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
].join(',');

export function createAppTheme(mode: ThemeMode) {
  const scheme = schemeColors(mode);

  return createTheme({
    palette: {
      mode,
      primary: scheme.primary,
      secondary: scheme.secondary,
      navy: colors.navy,
      hero: scheme.hero,
      background: scheme.background,
      text: scheme.text,
      divider: scheme.divider,
      error: colors.error,
      warning: colors.warning,
      info: colors.info,
      success: colors.success,
    },
    typography: {
      fontFamily,
      h1: { fontWeight: 600, letterSpacing: '-0.03em' },
      h2: { fontWeight: 600, letterSpacing: '-0.025em' },
      h3: { fontWeight: 600, letterSpacing: '-0.02em' },
      h4: { fontWeight: 600, letterSpacing: '-0.02em' },
      h5: { fontWeight: 600, letterSpacing: '-0.015em' },
      h6: { fontWeight: 600, letterSpacing: '-0.01em' },
      button: { fontWeight: 600 },
      subtitle1: { letterSpacing: '0.01em' },
    },
    shape: {
      borderRadius: 12,
    },
    components: componentOverrides,
  });
}

export const theme = createAppTheme('light');
