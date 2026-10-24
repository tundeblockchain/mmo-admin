import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { clickCatalogNav, renderCatalogApp } from '../../test/renderCatalogApp';
import { CatalogPage } from './CatalogPage';
import {
  clearDraftStoreForTesting,
  resetDraftMemoryForTesting,
} from '../../hooks/useDraftCatalog';
import { draftStorageKey } from '../../lib/draftPersistence';
import { mockClassCatalog, mockSkillCatalog } from '../../test/mocks/catalog-fixtures';
import { setupSignedInAuth } from '../../test/signedInAuth';

setupSignedInAuth();

describe('Draft persistence (MMO-29)', { timeout: 15_000 }, () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
  });

  it('keeps drafts keyed separately per catalog type and version', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      draftStorageKey('class', 1),
      JSON.stringify({
        schemaVersion: 1,
        savedAt: '2024-06-01T00:00:00.000Z',
        draft: {
          catalogType: 'class',
          sourceVersion: 1,
          isDirty: true,
          data: mockClassCatalog.data.map((item) =>
            item.classId === 'vanguard' ? { ...item, displayName: 'Class V1 Draft' } : item,
          ),
        },
      }),
    );
    localStorage.setItem(
      draftStorageKey('class', 2),
      JSON.stringify({
        schemaVersion: 1,
        savedAt: '2024-06-15T00:00:00.000Z',
        draft: {
          catalogType: 'class',
          sourceVersion: 2,
          isDirty: true,
          data: mockClassCatalog.data.map((item) =>
            item.classId === 'vanguard' ? { ...item, displayName: 'Class V2 Draft' } : item,
          ),
        },
      }),
    );
    localStorage.setItem(
      draftStorageKey('skill', 1),
      JSON.stringify({
        schemaVersion: 1,
        savedAt: '2024-06-10T00:00:00.000Z',
        draft: {
          catalogType: 'skill',
          sourceVersion: 1,
          isDirty: true,
          data: mockSkillCatalog.data.map((item) => ({
            ...item,
            displayName: 'Skill V1 Draft',
          })),
        },
      }),
    );

    renderCatalogApp();

    expect(await screen.findByText('Class V2 Draft')).toBeInTheDocument();
    expect(screen.queryByText('Class V1 Draft')).not.toBeInTheDocument();

    await clickCatalogNav(user, 'Skills');
    expect(await screen.findByText('Skill V1 Draft')).toBeInTheDocument();
    expect(
      screen.getByRole('status', { name: /restored unsaved draft/i }),
    ).toBeInTheDocument();
  });

  it('ignores corrupt stored drafts and does not crash', async () => {
    const user = userEvent.setup();
    localStorage.setItem(draftStorageKey('class', 2), '{not-json');

    render(<CatalogPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Classes Version/)).toBeInTheDocument();
    });
    expect(screen.queryByRole('status', { name: /restored unsaved draft/i })).not.toBeInTheDocument();
    expect(localStorage.getItem(draftStorageKey('class', 2))).toBeNull();

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: /v2/ }));
    await waitFor(() => {
      expect(screen.getByText('Vanguard')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /edit as draft/i })).toBeInTheDocument();
  });

  it('restores a newly editable field edit after remount', async () => {
    const user = userEvent.setup();
    const { unmount } = renderCatalogApp();

    await clickCatalogNav(user, 'Skills');
    const select = await screen.findByRole('combobox');
    await user.click(select);
    await user.click(await screen.findByRole('option', { name: /v1/ }));
    await waitFor(() => {
      expect(screen.getByText('Cleaving Strike')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /edit as draft/i }));
    await user.click(screen.getByText('Cleaving Strike'));
    await user.click(screen.getByRole('button', { name: /resource effects/i }));

    const amount = screen.getByRole('spinbutton', { name: 'Amount' });
    await user.clear(amount);
    await user.type(amount, '12');

    await waitFor(() => {
      expect(localStorage.getItem(draftStorageKey('skill', 1))).toContain('"amount":12');
    });

    unmount();
    resetDraftMemoryForTesting();
    renderCatalogApp();

    await clickCatalogNav(user, 'Skills');
    expect(
      await screen.findByRole('status', { name: /restored unsaved draft/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/editing draft \(from v1\)/i)).toBeInTheDocument();
    await user.click(await screen.findByText('Cleaving Strike'));
    await user.click(screen.getByRole('button', { name: /resource effects/i }));
    expect(screen.getByRole('spinbutton', { name: 'Amount' })).toHaveValue(12);
  });
});
