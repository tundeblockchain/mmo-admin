import { test, expect } from '@playwright/test';
import { installCatalogRoutes } from '../fixtures/catalog';
import { missingRealAuthEnvNames, realAuthSkipMessage } from '../lib/realAuthEnv';

const missing = missingRealAuthEnvNames();
const email = process.env.E2E_TEST_EMAIL;
const password = process.env.E2E_TEST_PASSWORD;

test.describe('Real Firebase email/password sign-in', () => {
  test.skip(missing.length > 0, realAuthSkipMessage(missing));

  test('signs in with Firebase email and password from the environment', async ({ page }) => {
    const stillMissing = missingRealAuthEnvNames();
    if (stillMissing.length > 0 || !email || !password) {
      test.skip(true, realAuthSkipMessage(stillMissing));
      return;
    }

    await installCatalogRoutes(page);
    await page.goto('/');
    await expect(page.getByTestId('auth-email')).toBeVisible();
    await expect(page.getByTestId('auth-password')).toBeVisible();

    await page.getByTestId('auth-email').fill(email);
    await page.getByTestId('auth-password').fill(password);
    await page.getByTestId('auth-submit-sign-in').click();

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible();
  });
});
