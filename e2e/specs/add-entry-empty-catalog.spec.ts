import { test, expect } from '../fixtures/test';

test.describe('Add entry from an empty catalog', () => {
  test.use({ catalogApi: { emptyCatalog: true } });

  test('adds a class and publishes version 1', async ({ page }) => {
    await page.goto('/catalog/classes');

    await expect(page.getByRole('heading', { name: 'Catalog' })).toBeVisible();
    await expect(page.getByText(/no published class catalog yet/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /add class/i })).toBeEnabled();

    await page.getByRole('button', { name: /add class/i }).click();
    const dialog = page.getByRole('dialog', { name: /add class/i });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('textbox', { name: 'Class ID' }).fill('warden');
    await dialog.getByRole('button', { name: /add entry/i }).click();
    await expect(dialog).toHaveCount(0);

    await expect(page.getByText(/editing draft \(new catalog\)/i)).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Class ID' })).toHaveValue('warden');

    await page.getByRole('button', { name: /publish class/i }).click();
    await expect(page.getByText(/create version 1 of this catalog/i)).toBeVisible();
    await page.getByRole('button', { name: /review & publish/i }).click();
    await page.getByRole('button', { name: /confirm publish/i }).click();

    await expect(page.getByText(/published class v1/i)).toBeVisible();
  });
});
