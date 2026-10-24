import { vi } from 'vitest';
import { getIdToken } from '../auth';

export function forceRefreshCallCount(): number {
  return vi
    .mocked(getIdToken)
    .mock.calls.filter((call) => call[0] === true).length;
}
