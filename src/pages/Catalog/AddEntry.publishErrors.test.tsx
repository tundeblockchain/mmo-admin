import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { server } from '../../test/mocks/server';
import { CatalogPage } from './CatalogPage';
import { clearDraftStoreForTesting } from '../../hooks/useDraftCatalog';
import { submitAddClassEntry } from '../../test/draftEditingTestUtils';
import { mockEmptyCatalogApi } from '../../test/emptyCatalogTestUtils';
import { setupSignedInAuth } from '../../test/signedInAuth';

setupSignedInAuth();

describe('Empty catalog publish errors (MMO-39)', { timeout: 15_000 }, () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
    mockEmptyCatalogApi();
  });

  it('shows a 409 error and refetches published versions', async () => {
    let versionListCalls = 0;
    server.use(
      http.get('*/catalog/versions', () => {
        versionListCalls += 1;
        if (versionListCalls === 1) {
          return HttpResponse.json([]);
        }
        return HttpResponse.json({
          versions: [
            {
              catalogType: 'class',
              version: 1,
              status: 'published',
              publishedAt: '2024-06-20T00:00:00.000Z',
            },
          ],
        });
      }),
      http.post('*/catalog/class/versions', () => {
        return HttpResponse.json(
          { error: 'Version 1 already exists for class.' },
          { status: 409 },
        );
      }),
    );

    const user = userEvent.setup();
    render(<CatalogPage />);
    expect(await screen.findByRole('button', { name: /add class/i })).toBeEnabled();
    await submitAddClassEntry(user, 'warden');

    await user.click(screen.getByRole('button', { name: /publish class/i }));
    await user.click(screen.getByRole('button', { name: /review & publish/i }));
    await user.click(screen.getByRole('button', { name: /confirm publish/i }));

    expect(await screen.findByText(/this version already exists/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(versionListCalls).toBeGreaterThan(1);
    });
  });
});
