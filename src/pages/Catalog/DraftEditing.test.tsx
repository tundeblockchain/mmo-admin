import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { CatalogPage } from './CatalogPage';
import { clearDraftStoreForTesting } from '../../hooks/useDraftCatalog';
import { setupSignedInAuth } from '../../test/signedInAuth';

setupSignedInAuth();

describe('Draft Editing and Publishing', { timeout: 15_000 }, () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
  });

  describe('Skill Editor', () => {
    it('dirty draft enables Confirm publish', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);

      const skillsTab = screen.getByRole('tab', { name: 'Skills' });
      await user.click(skillsTab);

      await waitFor(() => {
        expect(screen.getByLabelText(/Skills Version/)).toBeInTheDocument();
      });

      const select = screen.getByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v1/ });
      await user.click(option);

      await waitFor(() => {
        expect(screen.getByText('Cleaving Strike')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit as draft/i });
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
      });

      await user.click(screen.getByText('Cleaving Strike'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Skill Editor' })).toBeInTheDocument();
      });

      const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
      await user.clear(displayNameInput);
      await user.type(displayNameInput, 'Modified Strike');

      await waitFor(() => {
        expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /publish skill/i })).toBeEnabled();
    });
  });
  describe('Status Editor', () => {
    it('dirty draft enables Confirm publish', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);

      const statusesTab = screen.getByRole('tab', { name: 'Statuses' });
      await user.click(statusesTab);

      await waitFor(() => {
        expect(screen.getByLabelText(/Statuses Version/)).toBeInTheDocument();
      });

      const select = screen.getByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v1/ });
      await user.click(option);

      await waitFor(() => {
        expect(screen.getByText('Flame')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit as draft/i });
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
      });

      await user.click(screen.getByText('Flame'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Status Editor' })).toBeInTheDocument();
      });

      const maxStacksInput = screen.getByRole('spinbutton', { name: 'Max Stacks' });
      await user.clear(maxStacksInput);
      await user.type(maxStacksInput, '5');

      await waitFor(() => {
        expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /publish status/i })).toBeEnabled();
    });
  });
});
