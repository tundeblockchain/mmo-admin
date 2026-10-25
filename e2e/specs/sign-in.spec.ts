import { catalogLabelForType } from '../../src/lib/catalogRoutes';
import { test, expect } from '../fixtures/test';

test.describe('Sign-in flow', () => {
  test.use({ e2eAuth: 'signed-out' });

  test('shows the login page to signed-out visitors', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'MMO Admin' })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in with google/i })).toBeVisible();
    await expect(page.getByTestId('auth-email')).toBeVisible();
    await expect(page.getByTestId('auth-password')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toHaveCount(0);
  });

  test('signs in with the E2E-gated email and password stub', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('auth-email').fill('admin@example.com');
    await page.getByTestId('auth-password').fill('password123');
    await page.getByTestId('auth-submit-sign-in').click();

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible();
  });

  test('signs in with the E2E-gated Google stub', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /sign in with google/i }).click();

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Catalog' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Classes' })).toBeVisible();
  });

  test('opens register and forgot-password screens', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('auth-link-register').click();
    await expect(page.getByTestId('auth-screen-register')).toBeVisible();
    await expect(page.getByTestId('auth-confirm-password')).toBeVisible();

    await page.getByTestId('auth-link-sign-in').click();
    await page.getByTestId('auth-link-forgot-password').click();
    await expect(page.getByTestId('auth-screen-forgot-password')).toBeVisible();
    await expect(page.getByRole('button', { name: /send reset link/i })).toBeVisible();
  });

  test('keeps a signed-out user on login when visiting catalog', async ({ page }) => {
    await page.goto('/catalog');

    await expect(page.getByRole('button', { name: /sign in with google/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: catalogLabelForType('class') })).toHaveCount(0);
  });
});
