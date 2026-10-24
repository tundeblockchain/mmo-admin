import { describe, expect, it } from 'vitest';
import { isAdminAccountType } from './account';

describe('isAdminAccountType', () => {
  it('treats only admin as admin and defaults new accounts to player', () => {
    expect(isAdminAccountType('admin')).toBe(true);
    expect(isAdminAccountType('player')).toBe(false);
    expect(isAdminAccountType(undefined)).toBe(false);
    expect(isAdminAccountType(null)).toBe(false);
    expect(isAdminAccountType('')).toBe(false);
  });
});
