import type { BrandPalette, HeroPalette } from './colors';

declare module '@mui/material/styles' {
  interface Palette {
    navy: BrandPalette;
    hero: HeroPalette;
  }

  interface PaletteOptions {
    navy?: BrandPalette;
    hero?: HeroPalette;
  }
}

export {};
