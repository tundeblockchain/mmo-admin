import { useSyncExternalStore } from 'react';
import {
  getResolvedColorScheme,
  setColorScheme,
  subscribeColorScheme,
  toggleColorScheme,
} from './colorSchemeStore';

export function useColorScheme() {
  const mode = useSyncExternalStore(
    subscribeColorScheme,
    getResolvedColorScheme,
    () => 'light' as const,
  );

  return {
    mode,
    setColorScheme,
    toggleColorScheme,
  };
}
