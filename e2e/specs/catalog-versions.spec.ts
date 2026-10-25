import { catalogLabelForType } from '../../src/lib/catalogRoutes';
import { test, expect, selectCatalogVersion } from '../fixtures/test';

test.describe('Catalog version list and view', () => {
  test('lists published versions and shows class details', async ({ page }) => {
    await page.goto('/catalog');

    await expect(page.getByRole('heading', { name: catalogLabelForType('class'), level: 1 })).toBeVisible();
    await expect(page).toHaveURL(/\/catalog\/classes$/);
    await expect(page.getByRole('link', { name: 'Classes' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page.getByRole('tab')).toHaveCount(0);
    await expect(page.getByText(/select a version above/i)).toBeVisible();

    await selectCatalogVersion(page, /Classes Version/, /v2/);

    await expect(page.getByText('Viewing version 2')).toBeVisible();
    await expect(page.getByText('Vanguard')).toBeVisible();
    await expect(page.getByText('Ranger')).toBeVisible();

    await page.getByText('Vanguard').click();
    await expect(page.getByRole('heading', { name: 'Vanguard' })).toBeVisible();
    await expect(page.getByText(/stalwart frontline defender/i)).toBeVisible();
  });

  test('switches catalog types from the sidebar and supports deep links and history', async ({
    page,
  }) => {
    await page.goto('/catalog');

    await page.getByRole('link', { name: 'Skills' }).click();
    await expect(page).toHaveURL(/\/catalog\/skills$/);
    await expect(page.getByRole('heading', { name: catalogLabelForType('skill'), level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Skills' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await selectCatalogVersion(page, /Skills Version/, /v1/);
    await expect(page.getByText('Cleaving Strike')).toBeVisible();

    await page.getByRole('link', { name: 'Resonance' }).click();
    await expect(page).toHaveURL(/\/catalog\/resonance$/);
    await expect(page.getByRole('heading', { name: catalogLabelForType('resonance'), level: 1 })).toBeVisible();
    await selectCatalogVersion(page, /Resonance Version/, /v1/);
    await expect(page.getByText('Valor')).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/\/catalog\/skills$/);
    await expect(page.getByText('Cleaving Strike')).toBeVisible();

    await page.goForward();
    await expect(page).toHaveURL(/\/catalog\/resonance$/);
    await expect(page.getByText('Valor')).toBeVisible();

    await page.goto('/catalog/elements');
    await expect(page.getByRole('heading', { name: catalogLabelForType('element'), level: 1 })).toBeVisible();
    await expect(page.getByLabel(/Elements Version/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Elements' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
