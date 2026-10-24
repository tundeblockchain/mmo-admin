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
    await expect(page.getByRole('button', { name: /sign in with google/i })).toBeVisible();

    await page.evaluate(async ([harnessEmail, harnessPassword]) => {
      const signIn = window.__E2E_SIGN_IN_WITH_EMAIL_PASSWORD__;
      if (!signIn) {
        throw new Error('E2E email/password harness is not available in this build');
      }
      await signIn(harnessEmail, harnessPassword);
    }, [email, password] as const);

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible();
  });
});
