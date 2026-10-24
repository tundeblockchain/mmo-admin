import type { BrandPalette, HeroPalette, SidebarPalette } from './colors';
import type { radii } from './radii';

declare module '@mui/material/styles' {
  interface Palette {
    navy: BrandPalette;
    hero: HeroPalette;
    sidebar: SidebarPalette;
  }

  interface PaletteOptions {
    navy?: BrandPalette;
    hero?: HeroPalette;
    sidebar?: SidebarPalette;
  }

  interface Theme {
    radii: typeof radii;
  }

  interface ThemeOptions {
    radii?: typeof radii;
  }
}

export {};
