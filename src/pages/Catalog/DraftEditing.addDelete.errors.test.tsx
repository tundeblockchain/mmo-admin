import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { CatalogPage } from './CatalogPage';
import { clearDraftStoreForTesting } from '../../hooks/useDraftCatalog';
import {
  ADMIN_FORBIDDEN_PUBLISH_MESSAGE,
  BAD_REQUEST_PUBLISH_MESSAGE,
} from '../../components/catalog/PublishDialog';
import { enterClassDraft } from '../../test/draftEditingTestUtils';

vi.mock('../../auth', () => ({
  getIdToken: vi.fn().mockResolvedValue('mock-firebase-jwt-token'),
}));

import { getIdToken } from '../../auth';

describe('Draft Editing and Publishing', { timeout: 15_000 }, () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
  });

  describe('Add and delete draft entries (MMO-25)', () => {
    it('blocks publishing an empty class draft until the wipe is confirmed', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);
      await enterClassDraft(user);

      await user.click(screen.getByRole('button', { name: /delete vanguard/i }));
      await user.click(screen.getByRole('button', { name: /^delete$/i }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /delete ranger/i }));
      await user.click(screen.getByRole('button', { name: /^delete$/i }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /publish class/i }));

      expect(
        screen.getByText(/this will publish an empty class catalog and remove all entries/i),
      ).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /review & publish/i }));
      expect(screen.getByRole('button', { name: /confirm publish/i })).toBeDisabled();

      await user.click(
        screen.getByRole('checkbox', {
          name: /i understand this will remove all class entries/i,
        }),
      );

      expect(screen.getByRole('button', { name: /confirm publish/i })).toBeEnabled();
    });
    it('shows an admin message on 403 and does not refresh or retry', async () => {
      let attempts = 0;
      server.use(
        http.post('*/catalog/:catalogType/versions', () => {
          attempts += 1;
          return HttpResponse.json({ error: 'Admin only' }, { status: 403 });
        }),
      );

      const user = userEvent.setup();
      render(<CatalogPage />);
      await enterClassDraft(user);

      await user.click(screen.getByText('Vanguard'));
      const displayNameInput = await screen.findByRole('textbox', { name: 'Display Name' });
      await user.type(displayNameInput, ' Updated');

      await user.click(screen.getByRole('button', { name: /publish class/i }));
      await user.click(await screen.findByRole('button', { name: /review & publish/i }));
      await user.click(await screen.findByRole('button', { name: /confirm publish/i }));

      expect(await screen.findByText(ADMIN_FORBIDDEN_PUBLISH_MESSAGE)).toBeInTheDocument();
      expect(attempts).toBe(1);
      expect(getIdToken).not.toHaveBeenCalledWith(true);
    });
    it('shows a clear message when the server rejects a 400 empty catalog', async () => {
      server.use(
        http.post('*/catalog/:catalogType/versions', () => {
          return HttpResponse.json(
            { error: 'Catalog data must not be an empty array' },
            { status: 400 },
          );
        }),
      );

      const user = userEvent.setup();
      render(<CatalogPage />);
      await enterClassDraft(user);

      await user.click(screen.getByRole('button', { name: /delete vanguard/i }));
      await user.click(screen.getByRole('button', { name: /^delete$/i }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /delete ranger/i }));
      await user.click(screen.getByRole('button', { name: /^delete$/i }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /publish class/i }));
      await user.click(screen.getByRole('button', { name: /review & publish/i }));
      await user.click(
        screen.getByRole('checkbox', {
          name: /i understand this will remove all class entries/i,
        }),
      );
      await user.click(screen.getByRole('button', { name: /confirm publish/i }));

      expect(await screen.findByText(BAD_REQUEST_PUBLISH_MESSAGE)).toBeInTheDocument();
    });
  });
});
