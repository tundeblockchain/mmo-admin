import type { Page } from '@playwright/test';

export type E2EAuthRole = 'admin' | 'player' | 'expired' | 'signed-out';

export interface E2EAuthUser {
  uid: string;
  email: string;
  displayName: string;
  idToken: string;
}

export const E2E_ADMIN: E2EAuthUser = {
  uid: 'e2e-admin-uid',
  email: 'admin@example.com',
  displayName: 'E2E Admin',
  idToken: 'e2e-admin-token',
};

export const E2E_PLAYER: E2EAuthUser = {
  uid: 'e2e-player-uid',
  email: 'player@example.com',
  displayName: 'E2E Player',
  idToken: 'e2e-player-token',
};

export const E2E_EXPIRED: E2EAuthUser = {
  uid: 'e2e-expired-uid',
  email: 'expired@example.com',
  displayName: 'E2E Expired',
  idToken: 'e2e-expired-token',
};

const USERS: Record<Exclude<E2EAuthRole, 'signed-out'>, E2EAuthUser> = {
  admin: E2E_ADMIN,
  player: E2E_PLAYER,
  expired: E2E_EXPIRED,
};

export async function installE2EAuth(page: Page, role: E2EAuthRole): Promise<void> {
  const user = role === 'signed-out' ? null : USERS[role];

  await page.addInitScript((payload) => {
    window.__E2E_AUTH__ = payload;
  }, { enabled: true, user });
}
