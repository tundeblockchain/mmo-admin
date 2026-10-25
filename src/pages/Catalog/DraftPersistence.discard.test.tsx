import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent, within } from '../../test/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { CatalogPage } from './CatalogPage';
import { clearDraftStoreForTesting } from '../../hooks/useDraftCatalog';
import { draftStorageKey } from '../../lib/draftPersistence';
import { seedClassDraft } from '../../test/draftPersistenceTestUtils';
import { setupSignedInAuth } from '../../test/signedInAuth';

setupSignedInAuth();

describe('Draft persistence (MMO-29)', { timeout: 15_000 }, () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
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

    expect(await screen.findByText(/this version already exists/i)).toBeInTheDocument();
    expect(localStorage.getItem(draftStorageKey('class', 2))).toBeTruthy();
    expect(screen.getByText('Keep Me')).toBeInTheDocument();
  });
});
