export type ThemeMode = 'light' | 'dark';

export interface BrandPalette {
  main: string;
  light: string;
  dark: string;
  contrastText: string;
}

export interface HeroPalette {
  from: string;
  mid: string;
  to: string;
  glass: string;
  glassBorder: string;
  glow: string;
}

export interface SchemeColors {
  background: {
    default: string;
    paper: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  divider: string;
  primary: BrandPalette;
  secondary: BrandPalette;
  hero: HeroPalette;
}

const tokens = {
  white: '#FFFFFF',
  blue50: '#E8F2FF',
  blue200: '#90CAF9',
  blue300: '#64B5F6',
  blue400: '#42A5F5',
  blue500: '#1E88E5',
  blue600: '#1565C0',
  blue700: '#0D47A1',
  cyan400: '#29B6F6',
  cyan600: '#0288D1',
  cyan700: '#0277BD',
  navy500: '#1B3A63',
  navy700: '#122848',
  navy800: '#0B1D36',
  navy900: '#061224',
  slate50: '#F4F7FB',
  slate100: '#E6EEF6',
  slate300: '#C3D0E0',
  slate400: '#8AA0B8',
  slate600: '#3D5270',
  slate800: '#0E1C2F',
  ink900: '#09111D',
  glassLight: 'rgba(255, 255, 255, 0.86)',
  glassDark: 'rgba(9, 17, 29, 0.72)',
  glassBorderLight: 'rgba(255, 255, 255, 0.45)',
  glassBorderDark: 'rgba(100, 181, 246, 0.28)',
  glowLight: 'rgba(66, 165, 245, 0.28)',
  glowDark: 'rgba(30, 136, 229, 0.22)',
  error: '#D32F2F',
  warning: '#ED6C02',
  info: '#0288D1',
  success: '#2E7D32',
} as const;

export const colors = {
  tokens,
  navy: {
    main: tokens.navy800,
    light: tokens.navy500,
    dark: tokens.navy900,
    contrastText: tokens.slate50,
  } satisfies BrandPalette,
  error: {
    main: tokens.error,
  },
  warning: {
    main: tokens.warning,
  },
  info: {
    main: tokens.info,
  },
  success: {
    main: tokens.success,
  },
  light: {
    background: {
      default: tokens.slate50,
      paper: tokens.white,
    },
    text: {
      primary: tokens.slate800,
      secondary: tokens.slate600,
    },
    divider: tokens.slate300,
    primary: {
      main: tokens.blue600,
      light: tokens.blue400,
      dark: tokens.blue700,
      contrastText: tokens.white,
    },
    secondary: {
      main: tokens.cyan600,
      light: tokens.cyan400,
      dark: tokens.cyan700,
      contrastText: tokens.white,
    },
    hero: {
      from: tokens.navy900,
      mid: tokens.navy800,
      to: tokens.blue600,
      glass: tokens.glassLight,
      glassBorder: tokens.glassBorderLight,
      glow: tokens.glowLight,
    },
  } satisfies SchemeColors,
  dark: {
    background: {
      default: tokens.ink900,
      paper: tokens.navy700,
    },
    text: {
      primary: tokens.slate100,
      secondary: tokens.slate400,
    },
    divider: tokens.navy500,
    primary: {
      main: tokens.blue300,
      light: tokens.blue200,
      dark: tokens.blue500,
      contrastText: tokens.navy900,
    },
    secondary: {
      main: tokens.cyan400,
      light: tokens.blue200,
      dark: tokens.cyan600,
      contrastText: tokens.navy900,
    },
    hero: {
      from: tokens.ink900,
      mid: tokens.navy800,
      to: tokens.blue700,
      glass: tokens.glassDark,
      glassBorder: tokens.glassBorderDark,
      glow: tokens.glowDark,
    },
  } satisfies SchemeColors,
} as const;

export function schemeColors(mode: ThemeMode): SchemeColors {
  return mode === 'dark' ? colors.dark : colors.light;
}
