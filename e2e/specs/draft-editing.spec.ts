import { test, expect, openCatalogDraft, openClassDraft } from '../fixtures/test';

test.describe('Draft editing', () => {
  test('adds and deletes class entries and edits writable fields', async ({ page }) => {
    await openClassDraft(page);

    await page.getByText('Vanguard').click();
    const displayName = page.getByRole('textbox', { name: 'Display Name' });
    await expect(displayName).toBeVisible();
    await displayName.fill('Frontline Vanguard');
    await expect(page.getByText(/unsaved changes/i)).toBeVisible();
    await expect(page.getByText('Frontline Vanguard')).toBeVisible();

    await page.getByRole('spinbutton', { name: 'Strength' }).fill('15');
    await expect(page.getByRole('spinbutton', { name: 'Strength' })).toHaveValue('15');

    await page.getByRole('button', { name: /add class/i }).click();
    await expect(page.getByText('New Class').first()).toBeVisible();
    await page.getByRole('textbox', { name: 'Class ID' }).fill('warden');
    await page.getByRole('textbox', { name: 'Display Name' }).fill('Warden');
    await expect(page.getByText('Warden')).toBeVisible();

    await page.getByRole('button', { name: /delete ranger/i }).click();
    await expect(page.getByRole('dialog', { name: /delete class/i })).toBeVisible();
    await page.getByRole('button', { name: /^delete$/i }).click();
    await expect(page.getByRole('dialog', { name: /delete class/i })).toHaveCount(0);
    await expect(page.getByText('Ranger')).toHaveCount(0);
    await expect(page.getByText('Frontline Vanguard')).toBeVisible();
    await expect(page.getByText('Warden')).toBeVisible();
  });

  test('edits percent fields as displayed percentages', async ({ page }) => {
    await openCatalogDraft(page, {
      tab: 'Resonance',
      versionLabel: /Resonance Version/,
      optionName: /v1/,
      publishedName: 'Valor',
    });

    await page.getByText('Valor').click();
    await expect(page.getByRole('heading', { name: 'Resonance Editor' })).toBeVisible();

    const bonusPercent = page.getByRole('spinbutton', { name: 'Multiplier (%)' }).first();
    await expect(bonusPercent).toHaveValue('10');
    await bonusPercent.fill('15');
    await expect(bonusPercent).toHaveValue('15');
    await expect(page.getByText(/unsaved changes/i)).toBeVisible();
  });

  test('edits skill PvP percent multipliers', async ({ page }) => {
    await openCatalogDraft(page, {
      tab: 'Skills',
      versionLabel: /Skills Version/,
      optionName: /v1/,
      publishedName: 'Cleaving Strike',
    });

    await page.getByText('Cleaving Strike').click();
    await expect(page.getByRole('heading', { name: 'Skill Editor' })).toBeVisible();
    await page.getByRole('button', { name: /pvp multipliers/i }).click();

    const damageMultiplier = page.getByLabel('Damage Multiplier (%)');
    await expect(damageMultiplier).toBeVisible();
    await damageMultiplier.fill('80');
    await expect(damageMultiplier).toHaveValue('80');
    await expect(page.getByText(/unsaved changes/i)).toBeVisible();
  });
});
