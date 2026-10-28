import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { render, screen, userEvent } from '../../test/test-utils';
import { server } from '../../test/mocks/server';
import {
  mockUser,
  mockSignOut,
  setMockAuthState,
  resetMockAuth,
} from '../../test/mocks/firebase-auth';
import { mockPlayerUser } from '../../test/mocks/user-handlers';
import { ACCOUNT_MESSAGES } from './accountMessages';
import { AdminGate } from './AdminGate';
import { ProtectedRoute } from '../ProtectedRoute/ProtectedRoute';
import { AUTH_TEST_IDS } from '../../pages/Login/authTestIds';

function renderGatedApp() {
  return render(
    <ProtectedRoute>
      <AdminGate>
        <div>
          <h1>Dashboard</h1>
          <nav aria-label="Catalog">Classes</nav>
        </div>
      </AdminGate>
    </ProtectedRoute>,
  );
}

describe('AdminGate', () => {
  beforeEach(() => {
    resetMockAuth();
    setMockAuthState(mockUser);
  });

  it('shows the admin app when /users/me returns accountType admin', async () => {
    renderGatedApp();

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Catalog' })).toBeInTheDocument();
    expect(screen.queryByTestId(AUTH_TEST_IDS.screenNotAdmin)).not.toBeInTheDocument();
  });

  it('shows the not-an-admin screen for a player and hides catalog pages', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('*/users/me', () => HttpResponse.json(mockPlayerUser)),
    );

    renderGatedApp();

    expect(
      await screen.findByRole('heading', { name: ACCOUNT_MESSAGES.notAdminTitle }),
    ).toBeInTheDocument();
    expect(screen.getByText(`Signed in as ${mockUser.email}`)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Dashboard' })).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Catalog' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /sign out/i }));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByRole('button', { name: /sign in with google/i }),
    ).toBeInTheDocument();
  });

  it('signs out and returns to login when /users/me returns 401', async () => {
    server.use(
      http.post('*/users/me', () => {
        return HttpResponse.json(
          { error: 'Valid Firebase ID token required' },
          { status: 401 },
        );
      }),
    );

    renderGatedApp();

    expect(
      await screen.findByRole('button', { name: /sign in with google/i }),
    ).toBeInTheDocument();
    expect(mockSignOut).toHaveBeenCalled();
    expect(screen.queryByTestId(AUTH_TEST_IDS.screenNotAdmin)).not.toBeInTheDocument();
    expect(screen.queryByTestId(AUTH_TEST_IDS.screenAccountRetry)).not.toBeInTheDocument();
  });

  it('shows a retry state on network errors instead of the admin screen', async () => {
    const user = userEvent.setup();
    let calls = 0;
    server.use(
      http.post('*/users/me', () => {
        calls += 1;
        if (calls === 1) {
          return HttpResponse.json({ error: 'Catalog unavailable' }, { status: 503 });
        }
        return HttpResponse.json({ uid: mockUser.uid, accountType: 'admin' });
      }),
    );

    renderGatedApp();

    expect(
      await screen.findByRole('alert', { name: ACCOUNT_MESSAGES.retryTitle }),
    ).toHaveTextContent(ACCOUNT_MESSAGES.retryBody);
    expect(screen.queryByTestId(AUTH_TEST_IDS.screenNotAdmin)).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Dashboard' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: ACCOUNT_MESSAGES.retryAction }));

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });
});
