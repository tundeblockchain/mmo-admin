import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { server } from '../../test/mocks/server';
import { CatalogPage } from './CatalogPage';
import { clearDraftStoreForTesting } from '../../hooks/useDraftCatalog';
import { submitAddClassEntry } from '../../test/draftEditingTestUtils';
import { mockEmptyCatalogApi } from '../../test/emptyCatalogTestUtils';
import { setupSignedInAuth } from '../../test/signedInAuth';

setupSignedInAuth();

describe('Empty catalog add-entry publish (MMO-39)', { timeout: 15_000 }, () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
    mockEmptyCatalogApi();
  });

  it('shows an empty state with Add enabled and publishes v1', async () => {
    const postCalled = vi.fn();
    server.use(
      http.post('*/catalog/class/versions', async ({ request }) => {
        postCalled(await request.json());
        return HttpResponse.json(
          {
            catalogType: 'class',
            version: 1,
            status: 'published',
            createdAt: '2024-06-20T00:00:00.000Z',
            publishedAt: '2024-06-20T00:00:00.000Z',
            createdBy: 'test-user',
          },
          { status: 201 },
        );
      }),
    );

    const user = userEvent.setup();
    render(<CatalogPage />);

    expect(
      await screen.findByText(/no published class catalog yet/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add class/i })).toBeEnabled();

    await submitAddClassEntry(user, 'warden');
    expect(screen.getByText(/editing draft \(new catalog\)/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /publish class/i }));
    expect(screen.getByText(/create version 1 of this catalog/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /review & publish/i }));
    await user.click(screen.getByRole('button', { name: /confirm publish/i }));

    await waitFor(() => {
      expect(screen.getByText(/published class v1/i)).toBeInTheDocument();
    });

    const body = postCalled.mock.calls[0][0] as {
      data: Array<{ classId: string }>;
      version?: number;
    };
    expect(body.version).toBeUndefined();
    expect(body.data).toEqual([expect.objectContaining({ classId: 'warden' })]);
  });
});
