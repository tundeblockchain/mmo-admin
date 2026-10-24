import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent, within } from '../../test/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { CatalogPage } from './CatalogPage';
import {
  clearDraftStoreForTesting,
  resetDraftMemoryForTesting,
} from '../../hooks/useDraftCatalog';
import { draftStorageKey, writePersistedDraft } from '../../lib/draftPersistence';
import { mockClassCatalog, mockSkillCatalog } from '../../test/mocks/catalog-handlers';

vi.mock('../../auth', () => ({
  getIdToken: vi.fn().mockResolvedValue('mock-firebase-jwt-token'),
}));

function seedClassDraft(sourceVersion: number, displayName = 'Persisted Vanguard') {
  writePersistedDraft({
    catalogType: 'class',
    sourceVersion,
    isDirty: true,
    data: mockClassCatalog.data.map((item) =>
      item.classId === 'vanguard' ? { ...item, displayName } : item,
    ),
  });
}

describe('Draft persistence (MMO-29)', () => {
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

    render(<CatalogPage />);

    expect(await screen.findByText('Class V2 Draft')).toBeInTheDocument();
    expect(screen.queryByText('Class V1 Draft')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Skills' }));
    expect(await screen.findByText('Skill V1 Draft')).toBeInTheDocument();
    expect(
      screen.getByRole('status', { name: /restored unsaved draft/i }),
    ).toBeInTheDocument();
  });

  it('asks for confirmation before discard and then clears storage', async () => {
    const user = userEvent.setup();
    seedClassDraft(2, 'Discard Me');
    render(<CatalogPage />);

    expect(await screen.findByText('Discard Me')).toBeInTheDocument();
    expect(localStorage.getItem(draftStorageKey('class', 2))).toBeTruthy();

    await user.click(screen.getByRole('button', { name: /^discard draft$/i }));

    const dialog = await screen.findByRole('dialog', { name: /discard draft/i });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/revert to the published source version/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /discard draft/i })).not.toBeInTheDocument();
    });
    expect(screen.getByText('Discard Me')).toBeInTheDocument();
    expect(localStorage.getItem(draftStorageKey('class', 2))).toBeTruthy();

    await user.click(screen.getByRole('button', { name: /^discard draft$/i }));
    await user.click(screen.getByRole('button', { name: /^discard$/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /discard draft/i })).not.toBeInTheDocument();
    });
    expect(screen.queryByText('Discard Me')).not.toBeInTheDocument();
    expect(localStorage.getItem(draftStorageKey('class', 2))).toBeNull();
    expect(screen.getByText('Vanguard')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit as draft/i })).toBeInTheDocument();
  });

  it('clears the stored draft after a successful publish', async () => {
    const user = userEvent.setup();
    seedClassDraft(2, 'Publish Me');
    render(<CatalogPage />);

    expect(await screen.findByText('Publish Me')).toBeInTheDocument();
    await user.click(screen.getByText('Publish Me'));

    await user.click(screen.getByRole('button', { name: /publish class/i }));
    await user.click(await screen.findByRole('button', { name: /review & publish/i }));
    await user.click(await screen.findByRole('button', { name: /confirm publish/i }));

    await waitFor(() => {
      expect(screen.getByText(/published class/i)).toBeInTheDocument();
    });
    expect(localStorage.getItem(draftStorageKey('class', 2))).toBeNull();
    expect(screen.queryByRole('status', { name: /restored unsaved draft/i })).not.toBeInTheDocument();
  });

  it('warns when a restored draft is based on a stale published version', async () => {
    const user = userEvent.setup();
    seedClassDraft(1, 'Stale Vanguard');
    render(<CatalogPage />);

    expect(await screen.findByText('Stale Vanguard')).toBeInTheDocument();
    expect(
      await screen.findByRole('alert', { name: /based on an older version/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/publishing would build on an older version/i)).toBeInTheDocument();
    expect(screen.getByText(/was not merged/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /keep editing/i }));
    await waitFor(() => {
      expect(
        screen.queryByRole('alert', { name: /based on an older version/i }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText('Stale Vanguard')).toBeInTheDocument();
  });

  it('lets the user discard a stale-base draft after confirming', async () => {
    const user = userEvent.setup();
    seedClassDraft(1, 'Stale Vanguard');
    render(<CatalogPage />);

    expect(
      await screen.findByRole('alert', { name: /based on an older version/i }),
    ).toBeInTheDocument();

    const staleWarning = screen.getByRole('alert', { name: /based on an older version/i });
    await user.click(within(staleWarning).getByRole('button', { name: /discard draft/i }));
    await user.click(await screen.findByRole('button', { name: /^discard$/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /discard draft/i })).not.toBeInTheDocument();
    });
    expect(localStorage.getItem(draftStorageKey('class', 1))).toBeNull();
    expect(screen.queryByText('Stale Vanguard')).not.toBeInTheDocument();
    expect(screen.getByText('Vanguard')).toBeInTheDocument();
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

  it('does not restore a draft when publish fails', async () => {
    server.use(
      http.post('*/catalog/:catalogType/versions', () => {
        return HttpResponse.json({ error: 'Conflict' }, { status: 409 });
      }),
    );

    const user = userEvent.setup();
    seedClassDraft(2, 'Keep Me');
    render(<CatalogPage />);

    expect(await screen.findByText('Keep Me')).toBeInTheDocument();
    await user.click(screen.getByText('Keep Me'));
    await user.click(screen.getByRole('button', { name: /publish class/i }));
    await user.click(await screen.findByRole('button', { name: /review & publish/i }));
    await user.click(await screen.findByRole('button', { name: /confirm publish/i }));

    expect(await screen.findByText(/version conflict/i)).toBeInTheDocument();
    expect(localStorage.getItem(draftStorageKey('class', 2))).toBeTruthy();
    expect(screen.getByText('Keep Me')).toBeInTheDocument();
  });

  it('restores a newly editable field edit after remount', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<CatalogPage />);

    await user.click(screen.getByRole('tab', { name: 'Skills' }));
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
    render(<CatalogPage />);

    await user.click(screen.getByRole('tab', { name: 'Skills' }));
    expect(
      await screen.findByRole('status', { name: /restored unsaved draft/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/editing draft \(from v1\)/i)).toBeInTheDocument();
    await user.click(await screen.findByText('Cleaving Strike'));
    await user.click(screen.getByRole('button', { name: /resource effects/i }));
    expect(screen.getByRole('spinbutton', { name: 'Amount' })).toHaveValue(12);
  });
});
