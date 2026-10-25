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

  test('player account cannot open Publish and sees a non-admin notice', async ({ page }) => {
    await openClassDraft(page);

    await expect(
      page.getByRole('status', { name: /account is not an admin/i }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /publish class/i })).toBeDisabled();
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

test.describe('Account-based publish gating (MMO-30)', () => {
  test.use({ e2eAuth: 'player', catalogApi: { accountType: 'player' } });

  test('disables Publish for a player from POST /users/me', async ({ page }) => {
    await openClassDraft(page);

    await expect(
      page.getByRole('status', { name: /account is not an admin/i }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /publish class/i })).toBeDisabled();
  });
});

