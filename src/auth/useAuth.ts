import { useSyncExternalStore } from 'react';
import {
  subscribeToAuth,
  getAuthSnapshot,
  getAuthServerSnapshot,
} from './authStore';

export function useAuth() {
  return useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getAuthServerSnapshot,
  );
}
