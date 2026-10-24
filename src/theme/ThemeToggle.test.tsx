import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeModeProvider } from './ThemeModeProvider';
import { ThemeToggle } from './ThemeToggle';
import {
  COLOR_SCHEME_STORAGE_KEY,
  resetColorSchemeForTesting,
} from './colorSchemeStore';

function mockPrefersColorScheme(isDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes('prefers-color-scheme: dark') ? isDark : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

function renderToggle() {
  return render(
    <ThemeModeProvider>
      <ThemeToggle />
    </ThemeModeProvider>,
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    resetColorSchemeForTesting();
    mockPrefersColorScheme(false);
  });

  afterEach(() => {
    resetColorSchemeForTesting();
  });

  it('toggles from light mode to dark mode', async () => {
    const user = userEvent.setup();
    renderToggle();

    const toggle = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggle);

    expect(
      screen.getByRole('button', { name: /switch to light mode/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('persists the chosen mode to localStorage and restores it', async () => {
    const user = userEvent.setup();
    const { unmount } = renderToggle();

    await user.click(screen.getByRole('button', { name: /switch to dark mode/i }));
    expect(window.localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)).toBe('dark');

    unmount();
    mockPrefersColorScheme(false);
    renderToggle();

    expect(
      screen.getByRole('button', { name: /switch to light mode/i }),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)).toBe('dark');
  });

  it('falls back to the system color scheme when nothing is stored', () => {
    mockPrefersColorScheme(true);
    renderToggle();

    expect(
      screen.getByRole('button', { name: /switch to light mode/i }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(window.localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)).toBeNull();
  });

  it('uses the light system scheme when nothing is stored and the system is light', () => {
    mockPrefersColorScheme(false);
    renderToggle();

    expect(
      screen.getByRole('button', { name: /switch to dark mode/i }),
    ).toHaveAttribute('aria-pressed', 'false');
    expect(window.localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)).toBeNull();
  });
});
