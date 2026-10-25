import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { CatalogPage } from './CatalogPage';
import { clearDraftStoreForTesting } from '../../hooks/useDraftCatalog';
import { enterClassDraft, submitAddClassEntry } from '../../test/draftEditingTestUtils';
import { setupSignedInAuth } from '../../test/signedInAuth';

setupSignedInAuth();

describe('Draft Editing and Publishing', { timeout: 15_000 }, () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
  });

  describe('Add and delete draft entries (MMO-25)', () => {
    it('shows added and removed counts in the publish diff', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);
      await enterClassDraft(user);

      await user.click(screen.getByRole('button', { name: /delete ranger/i }));
      await user.click(screen.getByRole('button', { name: /^delete$/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
      });

      await submitAddClassEntry(user, 'warden');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /publish class/i })).toBeEnabled();
      });

      await user.click(screen.getByRole('button', { name: /publish class/i }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /publish class catalog/i })).toBeInTheDocument();
      });

      expect(screen.getByText('Added')).toBeInTheDocument();
      expect(screen.getByText('Removed')).toBeInTheDocument();
      expect(screen.getAllByText('1 entities')).toHaveLength(2);
      expect(screen.getByRole('button', { name: /review & publish/i })).toBeEnabled();
    });
    it('POSTs added entries and omits deleted ones without using PATCH', async () => {
      const postCalled = vi.fn();
      const patchCalled = vi.fn();

      server.use(
        http.post('*/catalog/:catalogType/versions', async ({ request }) => {
          postCalled(await request.json());
          return HttpResponse.json(
            {
              catalogType: 'class',
              version: 3,
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
      await enterClassDraft(user);

      await user.click(screen.getByRole('button', { name: /delete ranger/i }));
      await user.click(screen.getByRole('button', { name: /^delete$/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
      });

      await submitAddClassEntry(user, 'warden');

      await user.click(screen.getByRole('button', { name: /publish class/i }));
      await user.click(await screen.findByRole('button', { name: /review & publish/i }));
      await user.click(await screen.findByRole('button', { name: /confirm publish/i }));

      await waitFor(() => {
        expect(postCalled).toHaveBeenCalled();
      });

      expect(patchCalled).not.toHaveBeenCalled();

      const postedData = postCalled.mock.calls[0][0] as {
        data: Array<{ classId: string; startingStats: { movementSpeed: number } }>;
      };
      const ids = postedData.data.map((entry) => entry.classId);
      expect(ids).toContain('vanguard');
      expect(ids).toContain('warden');
      expect(ids).not.toContain('ranger');
      expect(postedData.data.find((entry) => entry.classId === 'warden')?.startingStats).toBeDefined();
    });
  });
});
