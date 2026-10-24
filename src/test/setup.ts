import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import './mocks/firebase-auth';
import { server } from './mocks/server';
import { clearDraftStoreForTesting } from '../hooks/useDraftCatalog';
import { resetColorSchemeForTesting } from '../theme';

if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
  clearDraftStoreForTesting();
  resetColorSchemeForTesting();
});
afterAll(() => server.close());
