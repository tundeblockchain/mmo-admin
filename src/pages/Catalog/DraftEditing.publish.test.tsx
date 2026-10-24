import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { CatalogPage } from './CatalogPage';
import { clearDraftStoreForTesting } from '../../hooks/useDraftCatalog';
import { setupSignedInAuth } from '../../test/signedInAuth';

setupSignedInAuth();

describe('Draft Editing and Publishing', { timeout: 15_000 }, () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
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

});
