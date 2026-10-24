import { apiClient } from './client';
import { ApiError } from '../lib/errors';
import type { CurrentUser } from '../types/account';

function parseCurrentUser(value: unknown): CurrentUser {
  if (typeof value !== 'object' || value === null) {
    throw new ApiError('Invalid account response', 200, value);
  }

  const record = value as Record<string, unknown>;
  if (typeof record.uid !== 'string' || typeof record.accountType !== 'string') {
    throw new ApiError('Invalid account response', 200, value);
  }

  return {
    uid: record.uid,
    accountType: record.accountType,
  };
}

export async function syncCurrentUser(): Promise<CurrentUser> {
  const response = await apiClient.post<unknown>('/users/me');
  return parseCurrentUser(response.data);
}
