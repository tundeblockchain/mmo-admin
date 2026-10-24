import { test, expect } from '@playwright/test';

const email = process.env.E2E_TEST_EMAIL;
const password = process.env.E2E_TEST_PASSWORD;
const hasRealAuthCredentials = Boolean(email && password);

test.describe('Real Firebase email/password sign-in', () => {
  test.skip(
    !hasRealAuthCredentials,
    'Skipping real sign-in: E2E_TEST_EMAIL and E2E_TEST_PASSWORD are not set',
  );

  test('signs in with Firebase email and password from the environment', async ({ page }) => {
    if (!email || !password) {
      test.skip(true, 'Skipping real sign-in: E2E_TEST_EMAIL and E2E_TEST_PASSWORD are not set');
      return;
    }

    await page.goto('/');

    await expect(page.getByRole('button', { name: /sign in with email/i })).toBeVisible();
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole('button', { name: /sign in with email/i }).click();

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible();
  });
});
