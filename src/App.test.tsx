import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import {
  mockUser,
  setMockAuthState,
  resetMockAuth,
} from './test/mocks/firebase-auth';
import { server } from './test/mocks/server';
import { App } from './App';

describe('App', () => {
  beforeEach(() => {
    resetMockAuth();
  });

  it('shows login page when unauthenticated and does not call /users/me', async () => {
    let accountCalls = 0;
    server.use(
      http.post('*/users/me', () => {
        accountCalls += 1;
        return HttpResponse.json({ uid: 'test-uid-123', accountType: 'admin' });
      }),
    );

    setMockAuthState(null);
    render(<App />);

    expect(
      screen.getByRole('button', { name: /sign in with google/i }),
    ).toBeInTheDocument();

    expect(accountCalls).toBe(0);
  });

  it('boots and renders the admin shell when authenticated', async () => {
    const authHeaders: Array<string | null> = [];
    server.use(
      http.post('*/users/me', ({ request }) => {
        authHeaders.push(request.headers.get('Authorization'));
        return HttpResponse.json({ uid: mockUser.uid, accountType: 'admin' });
      }),
    );

    setMockAuthState(mockUser);
    render(<App />);

    expect(
      await screen.findByRole('heading', { name: /mmo admin/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(authHeaders).toEqual(['Bearer mock-id-token']);
    });
  });

  it('renders the home page by default when authenticated', async () => {
    setMockAuthState(mockUser);
    render(<App />);

    expect(
      await screen.findByRole('heading', { name: /dashboard/i }),
    ).toBeInTheDocument();
  });
});
