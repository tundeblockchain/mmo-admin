import { describe, expect, it } from 'vitest';
import { colors } from './colors';
import { createAppTheme } from './createAppTheme';
import { radii } from './radii';

describe('createAppTheme', () => {
  it('exposes the sidebar background token in both palettes', () => {
    expect(createAppTheme('light').palette.sidebar.background).toBe(
      colors.light.sidebar.background,
    );
    expect(createAppTheme('dark').palette.sidebar.background).toBe(
      colors.dark.sidebar.background,
    );
  });

  it('exposes card and control radii on the theme', () => {
    const theme = createAppTheme('light');

    expect(theme.shape.borderRadius).toBe(radii.card);
    expect(theme.radii).toEqual(radii);
    expect(theme.radii.card).toBe(12);
    expect(theme.radii.control).toBe(8);
  });
});
