import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { clickCatalogNav, renderCatalogApp } from '../../test/renderCatalogApp';
import { CatalogPage } from './CatalogPage';
import { clearDraftStoreForTesting } from '../../hooks/useDraftCatalog';
import { enterCatalogDraft, enterClassDraft } from '../../test/draftEditingTestUtils';
import { setupSignedInAuth } from '../../test/signedInAuth';
import { lastEntryDeleteMessage } from '../../lib/evaluateCatalogDelete';

setupSignedInAuth();

describe('Delete catalog draft entries (MMO-41)', { timeout: 15_000 }, () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
  });

  it('requires confirmation before deleting an entry without dependents', async () => {
    const user = userEvent.setup();
    render(<CatalogPage />);
    await enterClassDraft(user);

    await user.click(screen.getByRole('button', { name: /delete ranger/i }));

    const dialog = await screen.findByRole('dialog', { name: /delete class/i });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/only affects the working copy/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
    });
    expect(screen.getByText('Ranger')).toBeInTheDocument();
  });

  it('blocks delete and lists dependents when other entries still reference it', async () => {
    const user = userEvent.setup();
    render(<CatalogPage />);
    await enterClassDraft(user);

    await user.click(screen.getByRole('button', { name: /delete vanguard/i }));

    expect(await screen.findByRole('dialog', { name: /cannot delete class/i })).toBeInTheDocument();
    expect(await screen.findByText('Cleaving Strike')).toBeInTheDocument();
    expect(screen.getByText('Skill')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^delete$/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /cannot delete class/i })).not.toBeInTheDocument();
    });
    expect(screen.getByText('Vanguard')).toBeInTheDocument();
  });

  it('blocks deleting the last entry in a section', async () => {
    const user = userEvent.setup();
    renderCatalogApp();

    await clickCatalogNav(user, 'Skills');
    await enterCatalogDraft(user, {
      versionLabel: /Skills Version/,
      optionName: /v1/,
      publishedName: 'Cleaving Strike',
    });

    await user.click(screen.getByRole('button', { name: /delete cleaving strike/i }));

    expect(await screen.findByRole('dialog', { name: /cannot delete skill/i })).toBeInTheDocument();
    expect(screen.getByText(lastEntryDeleteMessage('skill'))).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^delete$/i })).not.toBeInTheDocument();
    expect(screen.getByText('Cleaving Strike')).toBeInTheDocument();
  });
});
