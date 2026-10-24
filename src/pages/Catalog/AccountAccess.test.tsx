import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { server } from '../../test/mocks/server';
import { CatalogPage } from './CatalogPage';
import { clearDraftStoreForTesting } from '../../hooks/useDraftCatalog';
import {
  mockUser,
  setMockAuthState,
  resetMockAuth,
} from '../../test/mocks/firebase-auth';
import {
  ACCOUNT_VERIFICATION_ERROR_MESSAGE,
  NON_ADMIN_ACCOUNT_MESSAGE,
} from '../../components/account/AccountNotice';
import { mockAdminUser, mockPlayerUser } from '../../test/mocks/user-handlers';

async function enterClassDraft(user: ReturnType<typeof userEvent.setup>) {
  await waitFor(() => {
    expect(screen.getByLabelText(/Classes Version/)).toBeInTheDocument();
  });

  const select = screen.getByRole('combobox');
  await user.click(select);
  const option = await screen.findByRole('option', { name: /v2/ });
  await user.click(option);

  await waitFor(() => {
    expect(screen.getByText('Vanguard')).toBeInTheDocument();
  });

  await user.click(screen.getByRole('button', { name: /edit as draft/i }));

  await waitFor(() => {
    expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
  });
}

describe('Catalog account access (MMO-30)', () => {
  beforeEach(() => {
    resetMockAuth();
    setMockAuthState(mockUser);
    clearDraftStoreForTesting();
  });

  it('enables Publish for an admin account', async () => {
    const user = userEvent.setup();
    render(<CatalogPage />);

    await enterClassDraft(user);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /publish class/i })).toBeEnabled();
    });

    expect(
      screen.queryByRole('status', { name: /account is not an admin/i }),
    ).not.toBeInTheDocument();
  });

  it('shows a non-admin notice and disables Publish for a player', async () => {
    server.use(
      http.post('*/users/me', () => {
        return HttpResponse.json(mockPlayerUser);
      }),
    );

    const user = userEvent.setup();
    render(<CatalogPage />);

    expect(
      await screen.findByRole('status', { name: /account is not an admin/i }),
    ).toHaveTextContent(NON_ADMIN_ACCOUNT_MESSAGE);

    await enterClassDraft(user);

    expect(screen.getByText('Vanguard')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /publish class/i })).toBeDisabled();
  });

  it('shows a retryable error when /users/me fails and keeps catalog reads working', async () => {
    let calls = 0;

    server.use(
      http.post('*/users/me', () => {
        calls += 1;
        if (calls === 1) {
          return HttpResponse.json({ error: 'Catalog unavailable' }, { status: 503 });
        }
        return HttpResponse.json(mockAdminUser);
      }),
    );

    const user = userEvent.setup();
    render(<CatalogPage />);

    expect(
      await screen.findByRole('alert', { name: /account verification failed/i }),
    ).toHaveTextContent(ACCOUNT_VERIFICATION_ERROR_MESSAGE);

    await waitFor(() => {
      expect(screen.getByLabelText(/Classes Version/)).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    await user.click(select);
    await user.click(await screen.findByRole('option', { name: /v2/ }));

    await waitFor(() => {
      expect(screen.getByText('Vanguard')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /retry/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole('alert', { name: /account verification failed/i }),
      ).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /edit as draft/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /publish class/i })).toBeEnabled();
    });
  });
});
