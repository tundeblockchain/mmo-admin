import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { CatalogPage } from './CatalogPage';
import { clearDraftStoreForTesting } from '../../hooks/useDraftCatalog';

vi.mock('../../auth', () => ({
  getIdToken: vi.fn().mockResolvedValue('mock-firebase-jwt-token'),
}));

describe('Draft Editing and Publishing', { timeout: 15_000 }, () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
  });

  describe('Percent serialization', () => {
    it('serializes percent values as decimals in POST request', async () => {
      const postCalled = vi.fn();

      server.use(
        http.post('*/catalog/:catalogType/versions', async ({ request }) => {
          postCalled(await request.json());
          return HttpResponse.json(
            {
              catalogType: 'resonance',
              version: 2,
              status: 'published',
              createdAt: new Date().toISOString(),
              publishedAt: new Date().toISOString(),
              createdBy: 'test-user',
            },
            { status: 201 },
          );
        }),
      );

      const user = userEvent.setup();
      render(<CatalogPage />);

      const resonanceTab = screen.getByRole('tab', { name: 'Resonance' });
      await user.click(resonanceTab);

      const select = await screen.findByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v1/ });
      await user.click(option);

      await waitFor(() => {
        expect(screen.getByText('Valor')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit as draft/i });
      await user.click(editButton);

      await user.click(screen.getByText('Valor'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Resonance Editor' })).toBeInTheDocument();
      });

      const spinbuttons = screen.getAllByRole('spinbutton');
      const hpBonusInput = spinbuttons.find((input) =>
        input.closest('tr')?.querySelector('input')?.value === 'hp',
      );

      if (hpBonusInput) {
        await user.clear(hpBonusInput);
        await user.type(hpBonusInput, '15');
      }

      await waitFor(() => {
        expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /publish resonance/i }));
      await user.click(await screen.findByRole('button', { name: /review & publish/i }));
      await user.click(await screen.findByRole('button', { name: /confirm publish/i }));

      await waitFor(() => {
        expect(postCalled).toHaveBeenCalled();
      });

      const postedData = postCalled.mock.calls[0][0];
      expect(postedData.data[0].partyBonus[0].bonusPercent).toBe(0.15);
    });
  });

});
