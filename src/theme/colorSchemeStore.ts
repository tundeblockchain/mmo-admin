import type { ThemeMode } from './colors';

export const COLOR_SCHEME_STORAGE_KEY = 'mmo-admin-color-scheme';

type Listener = () => void;

const listeners = new Set<Listener>();

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

export function getStoredColorScheme(): ThemeMode | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
    return isThemeMode(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function getSystemColorScheme(): ThemeMode {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getResolvedColorScheme(): ThemeMode {
  return getStoredColorScheme() ?? getSystemColorScheme();
}

export function emitColorSchemeChange(): void {
  listeners.forEach((listener) => {
    listener();
  });
}

export function setColorScheme(mode: ThemeMode): void {
  window.localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, mode);
  emitColorSchemeChange();
}

export function toggleColorScheme(): ThemeMode {
  const next = getResolvedColorScheme() === 'dark' ? 'light' : 'dark';
  setColorScheme(next);
  return next;
}

export function resetColorSchemeForTesting(): void {
  window.localStorage.removeItem(COLOR_SCHEME_STORAGE_KEY);
  emitColorSchemeChange();
}

export function subscribeColorScheme(onStoreChange: Listener): () => void {
  listeners.add(onStoreChange);

  let media: MediaQueryList | null = null;
  const onMediaChange = () => {
    if (getStoredColorScheme() === null) {
      onStoreChange();
    }
  };

  if (typeof window.matchMedia === 'function') {
    media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', onMediaChange);
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === COLOR_SCHEME_STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(onStoreChange);
    media?.removeEventListener('change', onMediaChange);
    window.removeEventListener('storage', onStorage);
  };
}
