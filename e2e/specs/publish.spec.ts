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

  test('keeps at least one class so publish cannot send an empty array', async ({ page }) => {
    await openClassDraft(page);

    await page.getByRole('button', { name: /delete ranger/i }).click();
    await page.getByRole('button', { name: /^delete$/i }).click();
    await expect(page.getByText('Ranger')).toHaveCount(0);

    await page.getByRole('button', { name: /delete vanguard/i }).click();
    await expect(page.getByRole('dialog', { name: /cannot delete/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^delete$/i })).toHaveCount(0);
    await page.getByRole('button', { name: /close/i }).click();
    await expect(page.getByText('Vanguard')).toBeVisible();
  });
});

test.describe('Publish gating as player', () => {
  test.use({ e2eAuth: 'player' });

  test('player account never reaches catalog write actions', async ({ page }) => {
    await page.goto('/catalog/classes');

    await expect(page.getByRole('heading', { name: /this account has no admin access/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /publish class/i })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /edit as draft/i })).toHaveCount(0);
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

test.describe('Catalog write 403', () => {
  test.use({ catalogApi: { publishStatus: 403 } });

  test('shows admin access required when a catalog write returns 403', async ({ page }) => {
    await openClassDraft(page);
    await makeClassDraftDirty(page);
    await reviewPublish(page);
    await page.getByRole('button', { name: /confirm publish/i }).click();

    await expect(page.getByText(/admin access required/i)).toBeVisible();
  });
});

