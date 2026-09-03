import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { CatalogPage } from './CatalogPage';
import { clearDraftStoreForTesting } from '../../hooks/useDraftCatalog';

vi.mock('../../auth', () => ({
  getIdToken: vi.fn().mockResolvedValue('mock-firebase-jwt-token'),
}));

describe('Draft Editing and Publishing', () => {
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

  describe('Publish flow', () => {
    it('publishes via JWT POST and does not PATCH', async () => {
      const postCalled = vi.fn();
      const patchCalled = vi.fn();

      server.use(
        http.post('*/catalog/:catalogType/versions', async ({ request }) => {
          postCalled(await request.json());
          return HttpResponse.json(
            {
              catalogType: 'skill',
              version: 2,
              status: 'published',
              createdAt: new Date().toISOString(),
              publishedAt: new Date().toISOString(),
              createdBy: 'test-user',
            },
            { status: 201 },
          );
        }),
        http.patch('*/catalog/*', () => {
          patchCalled();
          return HttpResponse.json({ error: 'Not allowed' }, { status: 405 });
        }),
      );

      const user = userEvent.setup();
      render(<CatalogPage />);

      const skillsTab = screen.getByRole('tab', { name: 'Skills' });
      await user.click(skillsTab);

      const select = await screen.findByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v1/ });
      await user.click(option);

      await waitFor(() => {
        expect(screen.getByText('Cleaving Strike')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit as draft/i });
      await user.click(editButton);

      await user.click(screen.getByText('Cleaving Strike'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Skill Editor' })).toBeInTheDocument();
      });

      const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
      await user.type(displayNameInput, ' Modified');

      await waitFor(() => {
        expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /publish skill/i }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /publish skill catalog/i })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /review & publish/i }));
      await user.click(screen.getByRole('button', { name: /confirm publish/i }));

      await waitFor(() => {
        expect(postCalled).toHaveBeenCalled();
      });

      expect(patchCalled).not.toHaveBeenCalled();

      const postedData = postCalled.mock.calls[0][0];
      expect(postedData).toHaveProperty('data');
      expect(Array.isArray(postedData.data)).toBe(true);
    });

    it('does not use PATCH method for publishing', async () => {
      const patchCalled = vi.fn();

      server.use(
        http.patch('*/catalog/*', () => {
          patchCalled();
          return HttpResponse.json({ error: 'Not allowed' }, { status: 405 });
        }),
      );

      const user = userEvent.setup();
      render(<CatalogPage />);

      const skillsTab = screen.getByRole('tab', { name: 'Skills' });
      await user.click(skillsTab);

      const select = await screen.findByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v1/ });
      await user.click(option);

      await waitFor(() => {
        expect(screen.getByText('Cleaving Strike')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit as draft/i });
      await user.click(editButton);

      await user.click(screen.getByText('Cleaving Strike'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Skill Editor' })).toBeInTheDocument();
      });

      const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
      await user.type(displayNameInput, ' X');

      await user.click(screen.getByRole('button', { name: /publish skill/i }));
      await user.click(await screen.findByRole('button', { name: /review & publish/i }));
      await user.click(await screen.findByRole('button', { name: /confirm publish/i }));

      await waitFor(
        () => {
          expect(screen.getByText(/published skill/i)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      expect(patchCalled).not.toHaveBeenCalled();
    });
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
