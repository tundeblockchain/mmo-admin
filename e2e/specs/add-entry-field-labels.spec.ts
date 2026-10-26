import type { Locator, Page } from '@playwright/test';
import { test, expect, openCatalogDraft } from '../fixtures/test';
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

async function expectPlaceholderNotCoveringLabel(dialog: Locator, fieldName: string) {
  const combobox = dialog.getByRole('combobox', { name: fieldName });
  await expect(combobox).toContainText(/select/i);

  const label = dialog.locator('label', { hasText: new RegExp(`^${fieldName}$`) });
  await expect(label).toHaveAttribute('data-shrink', 'true');

  const labelBox = await label.boundingBox();
  const fieldBox = await combobox.boundingBox();
  expect(labelBox, `expected ${fieldName} label to be laid out`).toBeTruthy();
  expect(fieldBox, `expected ${fieldName} field to be laid out`).toBeTruthy();
  expect(labelBox!.y + labelBox!.height).toBeLessThan(fieldBox!.y + fieldBox!.height / 2);
}

async function expectFirstFieldLabelFullyVisible(dialog: Locator, labelText: string) {
  const label = dialog.locator('label', { hasText: new RegExp(`^${labelText}$`) });
  await expect(label).toBeVisible();

  const clipped = await label.evaluate((element) => {
    const form = element.closest('[role="dialog"]')?.querySelector('form');
    const content = form?.parentElement;
    if (!content) {
      return true;
    }
    return element.getBoundingClientRect().top < content.getBoundingClientRect().top;
  });
  expect(clipped).toBe(false);
}

test.describe('Add dialog catalog-select labels', () => {
  test('shrinks the Class placeholder label on Add Skill', async ({ page }) => {
    await openCatalogDraft(page, {
      section: 'Skills',
      versionLabel: /Skills Version/,
      optionName: /v1/,
      publishedName: 'Cleaving Strike',
    });

    await page.getByRole('button', { name: /add skill/i }).click();
    const dialog = page.getByRole('dialog', { name: /add skill/i });
    await expect(dialog).toBeVisible();

    const classField = dialog.getByRole('combobox', { name: 'Class' });
    await classField.scrollIntoViewIfNeeded();
    await expectPlaceholderNotCoveringLabel(dialog, 'Class');
  });
});

test.describe('Add dialogs from an empty catalog', () => {
  test.use({ catalogApi: { emptyCatalog: true } });

  test('shrinks Resonance on Add Class and keeps the first Combat Constants label visible', async ({
    page,
  }) => {
    await page.goto('/catalog/classes');
    await page.getByRole('button', { name: /add class/i }).click();
    const classDialog = page.getByRole('dialog', { name: /add class/i });
    await expect(classDialog).toBeVisible();
    await classDialog.getByRole('combobox', { name: 'Resonance' }).scrollIntoViewIfNeeded();
    await expectPlaceholderNotCoveringLabel(classDialog, 'Resonance');
    await page.keyboard.press('Escape');

    await page.goto('/catalog/combat-constants');
    await page.getByRole('button', { name: /add combat constants/i }).click();
    const combatDialog = page.getByRole('dialog', { name: /add combat constants/i });
    await expect(combatDialog).toBeVisible();
    await expectFirstFieldLabelFullyVisible(combatDialog, 'Physical Strength Multiplier');
  });

  test('captures empty-dropdown Add dialogs in light and dark themes', async ({ page }) => {
    await page.addInitScript((key) => {
      if (!window.localStorage.getItem(key)) {
        window.localStorage.setItem(key, 'light');
      }
    }, COLOR_SCHEME_STORAGE_KEY);

    const captures = [
      {
        path: '/catalog/classes',
        button: /add class/i,
        dialog: /add class/i,
        name: 'add_class',
        scrollField: 'Resonance',
      },
      {
        path: '/catalog/skills',
        button: /add skill/i,
        dialog: /add skill/i,
        name: 'add_skill',
        scrollField: 'Class',
      },
      {
        path: '/catalog/combat-constants',
        button: /add combat constants/i,
        dialog: /add combat constants/i,
        name: 'add_combat_constants',
      },
    ] as const;

    for (const theme of ['light', 'dark'] as const) {
      if (theme === 'dark') {
        await page.getByRole('button', { name: /switch to dark mode/i }).click();
        await expect(page.getByRole('button', { name: /switch to light mode/i })).toBeVisible();
      }

      for (const capture of captures) {
        await page.goto(capture.path);
        await page.getByRole('button', { name: capture.button }).click();
        const dialog = page.getByRole('dialog', { name: capture.dialog });
        if ('scrollField' in capture) {
          await dialog.getByRole('combobox', { name: capture.scrollField }).scrollIntoViewIfNeeded();
        }
        await screenshotDialog(page, dialog, `test-results/${capture.name}_${theme}.png`);
        await page.keyboard.press('Escape');
      }
    }
  });
});
