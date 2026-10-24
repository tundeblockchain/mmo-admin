import { test, expect, openClassDraft } from '../fixtures/test';

test.describe('Draft persistence', () => {
  test('restores draft edits after a page refresh', async ({ page }) => {
    await openClassDraft(page);

    await page.getByText('Vanguard').click();
    await page.getByRole('textbox', { name: 'Display Name' }).fill('Persisted Vanguard');
    await expect(page.getByText(/unsaved changes/i)).toBeVisible();
    await expect(page.getByText('Persisted Vanguard')).toBeVisible();

    await page.reload();

    await expect(page.getByRole('status', { name: /restored unsaved draft/i })).toBeVisible();
    await expect(page.getByText(/editing draft \(from v2\)/i)).toBeVisible();
    await expect(page.getByText('Persisted Vanguard')).toBeVisible();

    await page.getByText('Persisted Vanguard').click();
    await expect(page.getByRole('textbox', { name: 'Display Name' })).toHaveValue(
      'Persisted Vanguard',
    );
  });
});
