import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '../fixtures/test';

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../fixtures');

test.describe('Catalog JSON import and export', () => {
  test('imports a valid file into the draft only', async ({ page }) => {
    await page.goto('/catalog');
    await expect(page.getByRole('heading', { name: 'Classes', level: 1 })).toBeVisible();

    await page.getByRole('button', { name: /import json/i }).click();
    const dialog = page.getByRole('dialog', { name: /import catalog json/i });
    await expect(dialog).toBeVisible();

    await dialog.locator('input[type="file"]').setInputFiles(path.join(fixturesDir, 'import-valid.json'));
    await expect(dialog.getByText(/loaded status into draft/i)).toBeVisible();
    await dialog.getByRole('button', { name: /close/i }).click();

    await page.getByRole('navigation', { name: 'Catalog' }).getByRole('link', { name: 'Statuses' }).click();
    await expect(page.getByText(/editing draft/i)).toBeVisible();
    await expect(page.getByText('Imported Burn')).toBeVisible();
  });

  test('shows per-field errors and leaves the draft untouched for an invalid file', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByRole('button', { name: /import json/i }).click();
    const dialog = page.getByRole('dialog', { name: /import catalog json/i });

    await dialog.locator('input[type="file"]').setInputFiles(path.join(fixturesDir, 'import-invalid.json'));
    await expect(dialog.getByText(/import failed\. the draft was not changed/i)).toBeVisible();
    await expect(dialog.getByText(/skill\.0\.classId: referenced id does not exist/i)).toBeVisible();
    await dialog.getByRole('button', { name: /close/i }).click();

    await expect(page.getByText(/editing draft/i)).toHaveCount(0);
  });

  test('exports a downloadable JSON file', async ({ page }) => {
    await page.goto('/catalog');
    await expect(page.getByLabel(/Classes Version/)).toBeVisible();
    await page.getByLabel(/Classes Version/).click();
    await page.getByRole('option', { name: /v2/ }).click();
    await expect(page.getByText('Vanguard')).toBeVisible();

    await page.getByRole('button', { name: /export json/i }).click();
    const dialog = page.getByRole('dialog', { name: /export catalog json/i });
    await expect(dialog).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await dialog.getByRole('button', { name: /download json/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.json$/);
  });
});
