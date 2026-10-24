import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import './mocks/firebase-auth';
import { server } from './mocks/server';
import { clearDraftStoreForTesting } from '../hooks/useDraftCatalog';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
  clearDraftStoreForTesting();
});
afterAll(() => server.close());
