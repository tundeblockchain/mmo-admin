import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { CatalogPage } from './CatalogPage';
import { clearDraftStoreForTesting } from '../../hooks/useDraftCatalog';
import { enterClassDraft } from '../../test/draftEditingTestUtils';
import { setupSignedInAuth } from '../../test/signedInAuth';

setupSignedInAuth();

describe('Delete catalog draft publish (MMO-41)', { timeout: 15_000 }, () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
  });

  it('POSTs the reduced class array without PATCH or DELETE', async () => {
    const postCalled = vi.fn();
    const patchCalled = vi.fn();
    const deleteCalled = vi.fn();

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
      http.delete('*/catalog/*', () => {
        deleteCalled();
        return HttpResponse.json({ error: 'Not allowed' }, { status: 405 });
      }),
    );

    const user = userEvent.setup();
    render(<CatalogPage />);
    await enterClassDraft(user);

    await user.click(screen.getByRole('button', { name: /delete ranger/i }));
    await user.click(await screen.findByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
      expect(screen.queryByText('Ranger')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /publish class/i }));
    await user.click(await screen.findByRole('button', { name: /review & publish/i }));
    await user.click(await screen.findByRole('button', { name: /confirm publish/i }));

    await waitFor(() => {
      expect(postCalled).toHaveBeenCalled();
    });

    expect(patchCalled).not.toHaveBeenCalled();
    expect(deleteCalled).not.toHaveBeenCalled();

    const postedData = postCalled.mock.calls[0][0] as {
      data: Array<{ classId: string }>;
    };
    const ids = postedData.data.map((entry) => entry.classId);
    expect(ids).toEqual(['vanguard']);
  });
});
