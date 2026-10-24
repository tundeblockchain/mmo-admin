import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { render, screen, waitFor } from '../test/test-utils';
import {
  mockUser,
  mockUnverifiedUser,
  setMockAuthState,
  resetMockAuth,
} from '../test/mocks/firebase-auth';
import { server } from '../test/mocks/server';
import { useAccount } from './useAccount';

function AccountProbe() {
  const account = useAccount();

  return (
    <div>
      <p>{account.isPending ? 'Loading account' : 'Account ready'}</p>
      {account.accountType !== null && <p>{`type-${account.accountType}`}</p>}
      {account.isAdmin && <p>Admin access</p>}
      {account.isError && <p>Account error</p>}
    </div>
  );
}

describe('useAccount', () => {
  beforeEach(() => {
    resetMockAuth();
  });

  it('calls POST /users/me once after sign-in with the Bearer header', async () => {
    const authHeaders: Array<string | null> = [];

    server.use(
      http.post('*/users/me', ({ request }) => {
        authHeaders.push(request.headers.get('Authorization'));
        return HttpResponse.json({ uid: mockUser.uid, accountType: 'admin' });
      }),
    );

    setMockAuthState(null);
    const { rerender } = render(<AccountProbe />);

    expect(screen.getByText('Account ready')).toBeInTheDocument();
    expect(authHeaders).toHaveLength(0);

    setMockAuthState(mockUser);

    await waitFor(() => {
      expect(screen.getByText('Admin access')).toBeInTheDocument();
    });

    expect(authHeaders).toEqual(['Bearer mock-id-token']);

    rerender(<AccountProbe />);

    expect(screen.getByText('Admin access')).toBeInTheDocument();
    expect(authHeaders).toHaveLength(1);
  });

  it('does not call /users/me when signed out', async () => {
    let calls = 0;

    server.use(
      http.post('*/users/me', () => {
        calls += 1;
        return HttpResponse.json({ uid: mockUser.uid, accountType: 'admin' });
      }),
    );

    setMockAuthState(null);
    render(<AccountProbe />);

    expect(screen.getByText('Account ready')).toBeInTheDocument();
    await waitFor(() => {
      expect(calls).toBe(0);
    });
  });

  it('does not call /users/me while the email is unverified', async () => {
    let calls = 0;

    server.use(
      http.post('*/users/me', () => {
        calls += 1;
        return HttpResponse.json({ uid: mockUnverifiedUser.uid, accountType: 'player' });
      }),
    );

    setMockAuthState(mockUnverifiedUser);
    render(<AccountProbe />);

    expect(screen.getByText('Account ready')).toBeInTheDocument();
    await waitFor(() => {
      expect(calls).toBe(0);
    });
    expect(screen.queryByText('Admin access')).not.toBeInTheDocument();
  });

  it('exposes player accountType without treating it as admin', async () => {
    server.use(
      http.post('*/users/me', () => {
        return HttpResponse.json({ uid: mockUser.uid, accountType: 'player' });
      }),
    );

    setMockAuthState(mockUser);
    render(<AccountProbe />);

    await waitFor(() => {
      expect(screen.getByText('type-player')).toBeInTheDocument();
    });

    expect(screen.queryByText('Admin access')).not.toBeInTheDocument();
  });
});
