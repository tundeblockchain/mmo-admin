import { test, expect, openCatalogDraft } from '../fixtures/test';

test.describe('Add Skill class options from catalog', () => {
  test('lists published classes in the Add Skill class dropdown', async ({ page }) => {
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
    await expect(classField).toBeEnabled();
    await classField.click();
    await expect(page.getByRole('option', { name: 'Vanguard' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Ranger' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'arcanist' })).toHaveCount(0);
    await expect(page.getByRole('option', { name: 'machinist' })).toHaveCount(0);
  });
});

test.describe('Add Skill class options without classes', () => {
  test.use({ catalogApi: { emptyCatalog: true } });

  test('disables Class and links to the class catalog', async ({ page }) => {
    await page.goto('/catalog/skills');

    await page.getByRole('button', { name: /add skill/i }).click();
    const dialog = page.getByRole('dialog', { name: /add skill/i });
    await expect(dialog).toBeVisible();

    await expect(dialog.getByRole('combobox', { name: 'Class' })).toBeDisabled();
    await expect(dialog.getByText(/add a class first/i)).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'Classes' })).toHaveAttribute(
      'href',
      '/catalog/classes',
    );
    await expect(dialog.getByRole('button', { name: /add entry/i })).toBeDisabled();
  });
});
