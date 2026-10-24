import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { CatalogPage } from './CatalogPage';
import { clearDraftStoreForTesting } from '../../hooks/useDraftCatalog';

vi.mock('../../auth', () => ({
  getIdToken: vi.fn().mockResolvedValue('mock-firebase-jwt-token'),
}));

describe('Draft Editing and Publishing', { timeout: 15_000 }, () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
  });

  describe('Element Editor', () => {
    it('dirty draft enables Confirm publish', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);

      const elementsTab = screen.getByRole('tab', { name: 'Elements' });
      await user.click(elementsTab);

      await waitFor(() => {
        expect(screen.getByLabelText(/Elements Version/)).toBeInTheDocument();
      });

      const select = screen.getByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v1/ });
      await user.click(option);

      await waitFor(() => {
        expect(screen.getByText('Fire')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit as draft/i });
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
      });

      await user.click(screen.getByText('Fire'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Element Editor' })).toBeInTheDocument();
      });

      const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
      await user.clear(displayNameInput);
      await user.type(displayNameInput, 'Flame');

      await waitFor(() => {
        expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /publish element/i })).toBeEnabled();
    });
  });
  describe('Resonance Editor', () => {
    it('dirty draft enables Confirm publish', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);

      const resonanceTab = screen.getByRole('tab', { name: 'Resonance' });
      await user.click(resonanceTab);

      await waitFor(() => {
        expect(screen.getByLabelText(/Resonance Version/)).toBeInTheDocument();
      });

      const select = screen.getByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v1/ });
      await user.click(option);

      await waitFor(() => {
        expect(screen.getByText('Valor')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit as draft/i });
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
      });

      await user.click(screen.getByText('Valor'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Resonance Editor' })).toBeInTheDocument();
      });

      const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
      await user.clear(displayNameInput);
      await user.type(displayNameInput, 'Courage');

      await waitFor(() => {
        expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /publish resonance/i })).toBeEnabled();
    });
  });
});
