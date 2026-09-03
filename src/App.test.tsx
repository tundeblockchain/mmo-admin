import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  mockUser,
  setMockAuthState,
  resetMockAuth,
} from './test/mocks/firebase-auth';
import { App } from './App';

describe('App', () => {
  beforeEach(() => {
    resetMockAuth();
  });

  it('shows login page when unauthenticated', () => {
    setMockAuthState(null);
    render(<App />);

    expect(
      screen.getByRole('button', { name: /sign in with google/i }),
    ).toBeInTheDocument();
  });

  it('boots and renders the admin shell when authenticated', async () => {
    setMockAuthState(mockUser);
    render(<App />);

    expect(
      await screen.findByRole('heading', { name: /mmo admin/i }),
    ).toBeInTheDocument();
  });

  it('renders the home page by default when authenticated', async () => {
    setMockAuthState(mockUser);
    render(<App />);

    expect(
      await screen.findByRole('heading', { name: /dashboard/i }),
    ).toBeInTheDocument();
  });
});
