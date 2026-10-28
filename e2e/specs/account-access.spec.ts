import { test, expect } from '../fixtures/test';
import { E2E_PLAYER } from '../fixtures/auth';
import { catalogLabelForType } from '../../src/lib/catalogRoutes';

test.describe('Player account gate', () => {
  test.use({ e2eAuth: 'player', catalogApi: { accountType: 'player' } });

  test('shows a full-page not-an-admin screen and hides catalog pages', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /this account has no admin access/i })).toBeVisible();
    await expect(page.getByText(`Signed in as ${E2E_PLAYER.email}`)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toHaveCount(0);
    await expect(page.getByRole('navigation', { name: /main navigation/i })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: catalogLabelForType('class') })).toHaveCount(0);

    await page.goto('/catalog/classes');

    await expect(page.getByRole('heading', { name: /this account has no admin access/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /publish class/i })).toHaveCount(0);
  });

  test('signs the player out from the not-an-admin screen', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /sign out/i }).click();

    await expect(page.getByRole('button', { name: /sign in with google/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /this account has no admin access/i })).toHaveCount(0);
  });
});

test.describe('Expired users-me token', () => {
  test.use({ catalogApi: { usersMeStatus: 401 } });

  test('signs out and returns to login on a 401 from /users/me', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: /sign in with google/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /this account has no admin access/i })).toHaveCount(0);
  });
});

test.describe('Account verification retry', () => {
  test.use({ catalogApi: { usersMeStatus: 503 } });

  test('shows retry instead of the not-an-admin screen, then loads the admin app', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('alert', { name: /could not verify admin access/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /this account has no admin access/i })).toHaveCount(0);

    await page.getByRole('button', { name: /^retry$/i }).click();

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});
