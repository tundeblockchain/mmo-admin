import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent, within } from '../../test/test-utils';
import { clickCatalogNav, renderCatalogApp } from '../../test/renderCatalogApp';
import { CatalogPage } from './CatalogPage';
import { clearDraftStoreForTesting } from '../../hooks/useDraftCatalog';
import {
  enterClassDraft,
  submitAddClassEntry,
  submitAddEntryForm,
} from '../../test/draftEditingTestUtils';
import { setupSignedInAuth } from '../../test/signedInAuth';

setupSignedInAuth();

describe('Draft Editing and Publishing', { timeout: 15_000 }, () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
  });

  describe('Add and delete draft entries (MMO-25)', () => {
    it('adds a class with OpenAPI seed-shaped defaults', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);
      await enterClassDraft(user);

      await submitAddClassEntry(user, 'warden');

      expect(screen.getAllByText('New Class').length).toBeGreaterThan(0);
      expect(screen.getByRole('textbox', { name: 'Class ID' })).toHaveValue('warden');
      expect(screen.getByRole('spinbutton', { name: 'Strength' })).toHaveValue(10);
      expect(screen.getByRole('spinbutton', { name: 'Movement Speed' })).toHaveValue(5);
      expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
    });

    it('blocks empty and duplicate ids and shows the error next to the field', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);
      await enterClassDraft(user);

      await user.click(screen.getByRole('button', { name: /add class/i }));

      const dialog = await screen.findByRole('dialog', { name: /add class/i });
      const idInput = within(dialog).getByRole('textbox', { name: 'Class ID' });
      expect(within(dialog).getByText('ID is required')).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: /add entry/i })).toBeDisabled();

      await user.type(idInput, 'vanguard');

      expect(within(dialog).getByText('ID must be unique within this draft')).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: /add entry/i })).toBeDisabled();
    });

    it('requires confirmation before deleting an entry', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);
      await enterClassDraft(user);

      await user.click(screen.getByRole('button', { name: /delete vanguard/i }));

      const dialog = await screen.findByRole('dialog', { name: /delete class/i });
      expect(dialog).toBeInTheDocument();
      expect(screen.getByText(/only affects the working copy/i)).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
      });
      expect(screen.getByText('Vanguard')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /delete vanguard/i }));
      await user.click(screen.getByRole('button', { name: /^delete$/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
        expect(screen.queryByText('Vanguard')).not.toBeInTheDocument();
      });
      expect(screen.getByText('Ranger')).toBeInTheDocument();
      expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
    });

    it('does not offer add or delete on combat-constants', async () => {
      const user = userEvent.setup();
      renderCatalogApp();

      await clickCatalogNav(user, 'Combat Constants');

      const select = await screen.findByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v1/ });
      await user.click(option);

      await user.click(screen.getByRole('button', { name: /edit as draft/i }));

      await waitFor(() => {
        expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
      });

      expect(screen.queryByRole('button', { name: /add class/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /add skill/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /add status/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /^delete /i })).not.toBeInTheDocument();
    });

    it('adds a skill with seed-shaped defaults', async () => {
      const user = userEvent.setup();
      renderCatalogApp();

      await clickCatalogNav(user, 'Skills');
      const select = await screen.findByRole('combobox');
      await user.click(select);
      await user.click(await screen.findByRole('option', { name: /v1/ }));

      await waitFor(() => {
        expect(screen.getByText('Cleaving Strike')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /edit as draft/i }));
      await waitFor(() => {
        expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
      });
      await submitAddEntryForm(user, {
        openName: /add skill/i,
        dialogName: /add skill/i,
        idLabel: 'Skill ID',
        idValue: 'vanguard_new_skill',
      });

      expect(screen.getAllByText('New Skill').length).toBeGreaterThan(0);
      expect(screen.getByRole('textbox', { name: 'Skill ID' })).toHaveValue('vanguard_new_skill');
      expect(screen.getByRole('spinbutton', { name: 'Unlock Level' })).toHaveValue(1);

      await user.click(screen.getByRole('button', { name: /coefficients/i }));
      expect(screen.getByRole('spinbutton', { name: 'Base Power' })).toHaveValue(1.5);
    });

  });
});
