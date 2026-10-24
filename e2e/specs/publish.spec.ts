import { type Page } from '@playwright/test';
import { test, expect, openClassDraft } from '../fixtures/test';

async function makeClassDraftDirty(page: Page) {
  await page.getByText('Vanguard').click();
  await page.getByRole('textbox', { name: 'Display Name' }).fill('Published Vanguard');
  await expect(page.getByText(/unsaved changes/i)).toBeVisible();
}

async function reviewPublish(page: Page) {
  await page.getByRole('button', { name: /publish class/i }).click();
  await expect(page.getByRole('dialog', { name: /publish class catalog/i })).toBeVisible();
  await page.getByRole('button', { name: /review & publish/i }).click();
}

test.describe('Publish gating', () => {
  test('allows an admin to publish a dirty draft', async ({ page }) => {
    await openClassDraft(page);
    await makeClassDraftDirty(page);
    await reviewPublish(page);
    await page.getByRole('button', { name: /confirm publish/i }).click();

    await expect(page.getByText(/published class v3/i)).toBeVisible();
    await expect(page.getByRole('dialog', { name: /publish class catalog/i })).toHaveCount(0);
  });

  test('blocks empty publish until the wipe is acknowledged, then surfaces 400', async ({
    page,
  }) => {
    await openClassDraft(page);

    await page.getByRole('button', { name: /delete vanguard/i }).click();
    await page.getByRole('button', { name: /^delete$/i }).click();
    await expect(page.getByRole('dialog', { name: /delete class/i })).toHaveCount(0);

    await page.getByRole('button', { name: /delete ranger/i }).click();
    await page.getByRole('button', { name: /^delete$/i }).click();
    await expect(page.getByRole('dialog', { name: /delete class/i })).toHaveCount(0);

    await page.getByRole('button', { name: /publish class/i }).click();
    await expect(
      page.getByText(/this will publish an empty class catalog and remove all entries/i),
    ).toBeVisible();

    await page.getByRole('button', { name: /review & publish/i }).click();
    await expect(page.getByRole('button', { name: /confirm publish/i })).toBeDisabled();

    await page
      .getByRole('checkbox', { name: /i understand this will remove all class entries/i })
      .check();
    await expect(page.getByRole('button', { name: /confirm publish/i })).toBeEnabled();

    await page.getByRole('button', { name: /confirm publish/i }).click();
    await expect(
      page.getByText(/the server rejected this catalog\. an empty data array cannot be published/i),
    ).toBeVisible();
  });
});

test.describe('Publish gating as player', () => {
  test.use({ e2eAuth: 'player' });

  test('player token is treated as forbidden on publish', async ({ page }) => {
    await openClassDraft(page);
    await makeClassDraftDirty(page);
    await reviewPublish(page);
    await page.getByRole('button', { name: /confirm publish/i }).click();

    await expect(
      page.getByText(/your account isn't an admin, so it can't publish catalogs/i),
    ).toBeVisible();
  });
});

test.describe('Publish gating with expired auth', () => {
  test.use({ e2eAuth: 'expired' });

  test('expired token is treated as 401 on publish', async ({ page }) => {
    await openClassDraft(page);
    await makeClassDraftDirty(page);
    await reviewPublish(page);
    await page.getByRole('button', { name: /confirm publish/i }).click();

    await expect(
      page.getByText(/authentication required\. please sign in to publish/i),
    ).toBeVisible();
  });
});
