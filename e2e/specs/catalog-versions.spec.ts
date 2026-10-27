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
    await expect(page.getByLabel(/Classes Version/)).toContainText('v2');
    await expect(page.getByText('Viewing version 2')).toBeVisible();
    await expect(page.getByText('Vanguard')).toBeVisible();
    await expect(page.getByText('Ranger')).toBeVisible();
    await expect(page.getByText(/select a version above/i)).toHaveCount(0);

    await selectCatalogVersion(page, /Classes Version/, /v1/);
    await expect(page.getByText('Viewing version 1')).toBeVisible();
    await expect(page.getByText('Vanguard')).toBeVisible();

    await selectCatalogVersion(page, /Classes Version/, /v2/);
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
    await expect(page.getByLabel(/Skills Version/)).toContainText('v1');
    await expect(page.getByText('Cleaving Strike')).toBeVisible();

    await page.getByRole('link', { name: 'Resonance' }).click();
    await expect(page).toHaveURL(/\/catalog\/resonance$/);
    await expect(page.getByRole('heading', { name: catalogLabelForType('resonance'), level: 1 })).toBeVisible();
    await expect(page.getByLabel(/Resonance Version/)).toContainText('v1');
    await expect(page.getByText('Valor')).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/\/catalog\/skills$/);
    await expect(page.getByText('Cleaving Strike')).toBeVisible();

    await page.goForward();
    await expect(page).toHaveURL(/\/catalog\/resonance$/);
    await expect(page.getByText('Valor')).toBeVisible();

    await page.goto('/catalog/elements');
    await expect(page.getByRole('heading', { name: catalogLabelForType('element'), level: 1 })).toBeVisible();
    await expect(page.getByLabel(/Elements Version/)).toContainText('v1');
    await expect(page.getByRole('link', { name: 'Elements' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await page.goto('/catalog/combat-constants');
    await expect(page.getByLabel(/Combat Constants Version/)).toContainText('v1');
    await expect(page.getByText('Viewing version 1')).toBeVisible();
    await expect(page.getByText('Power Scaling')).toBeVisible();
  });
});

test.describe('Catalog empty published versions', () => {
  test.use({ catalogApi: { emptyCatalog: true } });

  test('shows an empty state instead of an error', async ({ page }) => {
    await page.goto('/catalog/classes');
    await expect(page.getByText(/no published class catalog yet/i)).toBeVisible();
    await expect(page.getByText(/select a version above/i)).toHaveCount(0);
    await expect(page.getByText(/failed to load/i)).toHaveCount(0);

    await page.getByRole('link', { name: 'Combat Constants' }).click();
    await expect(page.getByText(/no published combat constants catalog yet/i)).toBeVisible();
    await expect(page.getByText(/failed to load/i)).toHaveCount(0);
  });
});
