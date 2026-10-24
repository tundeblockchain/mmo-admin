import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  COLOR_SCHEME_STORAGE_KEY,
  getResolvedColorScheme,
  getStoredColorScheme,
  getSystemColorScheme,
  resetColorSchemeForTesting,
  setColorScheme,
  toggleColorScheme,
} from './colorSchemeStore';

function mockPrefersColorScheme(isDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes('prefers-color-scheme: dark') ? isDark : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
}

describe('colorSchemeStore', () => {
  beforeEach(() => {
    resetColorSchemeForTesting();
    mockPrefersColorScheme(false);
  });

  it('returns null when no preference is stored', () => {
    expect(getStoredColorScheme()).toBeNull();
  });

  it('resolves to the system scheme when storage is empty', () => {
    mockPrefersColorScheme(true);
    expect(getSystemColorScheme()).toBe('dark');
    expect(getResolvedColorScheme()).toBe('dark');
  });

  it('prefers the stored scheme over the system scheme', () => {
    mockPrefersColorScheme(true);
    setColorScheme('light');
    expect(getResolvedColorScheme()).toBe('light');
    expect(window.localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)).toBe('light');
  });

  it('toggles the resolved scheme and writes it to storage', () => {
    mockPrefersColorScheme(false);
    expect(toggleColorScheme()).toBe('dark');
    expect(getResolvedColorScheme()).toBe('dark');
    expect(toggleColorScheme()).toBe('light');
    expect(getResolvedColorScheme()).toBe('light');
  });

  it('ignores invalid stored values and uses the system scheme', () => {
    window.localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, 'midnight');
    mockPrefersColorScheme(true);
    expect(getStoredColorScheme()).toBeNull();
    expect(getResolvedColorScheme()).toBe('dark');
  });
});
