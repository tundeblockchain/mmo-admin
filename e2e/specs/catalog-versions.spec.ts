import { test, expect, selectCatalogVersion } from '../fixtures/test';

test.describe('Catalog version list and view', () => {
  test('lists published versions and shows class details', async ({ page }) => {
    await page.goto('/catalog');

    await expect(page.getByRole('heading', { name: 'Catalog' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Classes' })).toBeVisible();
    await expect(page.getByText(/select a version above/i)).toBeVisible();

    await selectCatalogVersion(page, /Classes Version/, /v2/);

    await expect(page.getByText('Viewing version 2')).toBeVisible();
    await expect(page.getByText('Vanguard')).toBeVisible();
    await expect(page.getByText('Ranger')).toBeVisible();

    await page.getByText('Vanguard').click();
    await expect(page.getByRole('heading', { name: 'Vanguard' })).toBeVisible();
    await expect(page.getByText(/stalwart frontline defender/i)).toBeVisible();
  });

  test('switches catalog types and loads that type’s versions', async ({ page }) => {
    await page.goto('/catalog');

    await page.getByRole('tab', { name: 'Skills' }).click();
    await selectCatalogVersion(page, /Skills Version/, /v1/);
    await expect(page.getByText('Cleaving Strike')).toBeVisible();

    await page.getByRole('tab', { name: 'Resonance' }).click();
    await selectCatalogVersion(page, /Resonance Version/, /v1/);
    await expect(page.getByText('Valor')).toBeVisible();
  });
});
