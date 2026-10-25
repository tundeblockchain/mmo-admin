import type { Locator } from '@playwright/test';
import { test, expect, openCatalogDraft, openClassDraft } from '../fixtures/test';

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

test.describe('Add dialog catalog-select labels', () => {
  test('shrinks the Resonance placeholder label on Add Class', async ({ page }) => {
    await openClassDraft(page);
    await page.getByRole('button', { name: /add class/i }).click();

    const dialog = page.getByRole('dialog', { name: /add class/i });
    await expect(dialog).toBeVisible();

    const resonance = dialog.getByRole('combobox', { name: 'Resonance' });
    await resonance.scrollIntoViewIfNeeded();
    await expectPlaceholderNotCoveringLabel(dialog, 'Resonance');
  });

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

test.describe('Add Combat Constants first-field label', () => {
  test.use({ catalogApi: { emptyCatalog: true } });

  test('keeps the first outlined label fully visible', async ({ page }) => {
    await page.goto('/catalog/combat-constants');

    await page.getByRole('button', { name: /add combat constants/i }).click();
    const dialog = page.getByRole('dialog', { name: /add combat constants/i });
    await expect(dialog).toBeVisible();

    const label = dialog.getByText('Physical Strength Multiplier', { exact: true });
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
  });
});
