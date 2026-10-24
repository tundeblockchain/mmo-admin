import { test, expect } from '../fixtures/test';

test.describe('Sign-in flow', () => {
  test.use({ e2eAuth: 'signed-out' });

  test('shows the login page to signed-out visitors', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'MMO Admin' })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in with google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in with email/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toHaveCount(0);
  });

  test('signs in with email and password using the auth stub', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel(/email/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('test-password');
    await page.getByRole('button', { name: /sign in with email/i }).click();

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /catalog/i })).toBeVisible();
  });

  test('keeps a signed-out user on login when visiting catalog', async ({ page }) => {
    await page.goto('/catalog');

    await expect(page.getByRole('button', { name: /sign in with email/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Catalog' })).toHaveCount(0);
  });
});
