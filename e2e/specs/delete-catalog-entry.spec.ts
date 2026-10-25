import { type Locator, type Page } from '@playwright/test';
import { test, expect, openCatalogDraft, openClassDraft } from '../fixtures/test';
import { COLOR_SCHEME_STORAGE_KEY } from '../../src/theme/colorSchemeStore';

async function screenshotDialog(page: Page, dialog: Locator, path: string): Promise<void> {
  await expect(dialog).toBeVisible();
  const box = await dialog.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });

  await page.screenshot({
    path,
    animations: 'disabled',
    clip: {
      x: Math.max(0, box.x - 12),
      y: Math.max(0, box.y - 12),
      width: box.width + 24,
      height: box.height + 24,
    },
  });
}

test.describe('Delete catalog entries via draft', () => {
  test('confirms delete, blocks dependents, and blocks the last entry', async ({ page }) => {
    const publishBodies: unknown[] = [];
    page.on('request', (request) => {
      if (request.method() === 'POST' && request.url().includes('/catalog/class/versions')) {
        publishBodies.push(request.postDataJSON());
      }
    });

    await openClassDraft(page);

    await page.getByRole('button', { name: /delete vanguard/i }).click();
    await expect(page.getByRole('dialog', { name: /cannot delete class/i })).toBeVisible();
    await expect(page.getByText('Cleaving Strike')).toBeVisible();
    await expect(page.getByRole('button', { name: /^delete$/i })).toHaveCount(0);
    await page.getByRole('button', { name: /close/i }).click();
    await expect(page.getByText('Vanguard')).toBeVisible();

    await page.getByRole('button', { name: /delete ranger/i }).click();
    await expect(page.getByRole('dialog', { name: /delete class/i })).toBeVisible();
    await expect(page.getByText(/only affects the working copy/i)).toBeVisible();
    await page.getByRole('button', { name: /^delete$/i }).click();
    await expect(page.getByRole('dialog', { name: /delete class/i })).toHaveCount(0);
    await expect(page.getByText('Ranger')).toHaveCount(0);
    await expect(page.getByText('Vanguard')).toBeVisible();

    await page.getByRole('button', { name: /publish class/i }).click();
    await page.getByRole('button', { name: /review & publish/i }).click();
    await page.getByRole('button', { name: /confirm publish/i }).click();
    await expect(page.getByText(/published class v3/i)).toBeVisible();

    expect(publishBodies).toHaveLength(1);
    const body = publishBodies[0] as { data: Array<{ classId: string }> };
    expect(body.data.map((entry) => entry.classId)).toEqual(['vanguard']);

    await openCatalogDraft(page, {
      section: 'Skills',
      versionLabel: /Skills Version/,
      optionName: /v1/,
      publishedName: 'Cleaving Strike',
    });
    await page.getByRole('button', { name: /delete cleaving strike/i }).click();
    await expect(page.getByRole('dialog', { name: /cannot delete skill/i })).toBeVisible();
    await expect(page.getByText(/the last skill cannot be deleted/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /^delete$/i })).toHaveCount(0);
  });

  test('captures confirm and dependent dialogs in light and dark themes', async ({ page }) => {
    await page.addInitScript((key) => {
      window.localStorage.setItem(key, 'light');
    }, COLOR_SCHEME_STORAGE_KEY);

    await openClassDraft(page);

    await page.getByRole('button', { name: /delete ranger/i }).click();
    const confirmLight = page.getByRole('dialog', { name: /delete class/i });
    await screenshotDialog(page, confirmLight, 'test-results/delete-confirm-light.png');
    await page.getByRole('button', { name: /cancel/i }).click();

    await page.getByRole('button', { name: /delete vanguard/i }).click();
    const dependentsLight = page.getByRole('dialog', { name: /cannot delete class/i });
    await expect(dependentsLight.getByText('Cleaving Strike')).toBeVisible();
    await screenshotDialog(page, dependentsLight, 'test-results/delete-dependents-light.png');
    await page.getByRole('button', { name: /close/i }).click();

    await page.getByRole('button', { name: /switch to dark mode/i }).click();
    await expect(page.getByRole('button', { name: /switch to light mode/i })).toBeVisible();

    await page.getByRole('button', { name: /delete ranger/i }).click();
    const confirmDark = page.getByRole('dialog', { name: /delete class/i });
    await screenshotDialog(page, confirmDark, 'test-results/delete-confirm-dark.png');
    await page.getByRole('button', { name: /cancel/i }).click();

    await page.getByRole('button', { name: /delete vanguard/i }).click();
    const dependentsDark = page.getByRole('dialog', { name: /cannot delete class/i });
    await expect(dependentsDark.getByText('Cleaving Strike')).toBeVisible();
    await screenshotDialog(page, dependentsDark, 'test-results/delete-dependents-dark.png');
  });
});
