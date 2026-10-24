import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { CatalogPage } from './CatalogPage';
import {
  clearDraftStoreForTesting,
  resetDraftMemoryForTesting,
} from '../../hooks/useDraftCatalog';
import { draftStorageKey } from '../../lib/draftPersistence';

vi.mock('../../auth', () => ({
  getIdToken: vi.fn().mockResolvedValue('mock-firebase-jwt-token'),
}));

describe('Draft persistence (MMO-29)', { timeout: 15_000 }, () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
  });

  it('persists catalog data to localStorage when a draft is edited', async () => {
    const user = userEvent.setup();
    render(<CatalogPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Classes Version/)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: /v2/ }));
    await waitFor(() => {
      expect(screen.getByText('Vanguard')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /edit as draft/i }));
    await user.click(screen.getByText('Vanguard'));

    const displayNameInput = await screen.findByRole('textbox', { name: 'Display Name' });
    await user.clear(displayNameInput);
    await user.type(displayNameInput, 'Stored Vanguard');

    await waitFor(() => {
      expect(localStorage.getItem(draftStorageKey('class', 2))).toContain('Stored Vanguard');
    });

    const raw = localStorage.getItem(draftStorageKey('class', 2));
    expect(raw).not.toMatch(/token|authorization|password|Bearer/i);
  });
  it('restores a saved draft after remount and shows a notice', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<CatalogPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Classes Version/)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: /v2/ }));
    await waitFor(() => {
      expect(screen.getByText('Vanguard')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /edit as draft/i }));
    await user.click(screen.getByText('Vanguard'));
    const displayNameInput = await screen.findByRole('textbox', { name: 'Display Name' });
    await user.clear(displayNameInput);
    await user.type(displayNameInput, 'Reloaded Vanguard');

    unmount();
    resetDraftMemoryForTesting();
    render(<CatalogPage />);

    expect(
      await screen.findByRole('status', { name: /restored unsaved draft/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/editing draft \(from v2\)/i)).toBeInTheDocument();
    expect(await screen.findByText('Reloaded Vanguard')).toBeInTheDocument();
  });
});
