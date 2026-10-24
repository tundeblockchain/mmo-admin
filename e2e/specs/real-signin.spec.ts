import { test, expect } from '@playwright/test';
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
