import { describe, expect, it, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import {
  mockUser,
  setMockAuthState,
  resetMockAuth,
} from '../../test/mocks/firebase-auth';
import { render } from '../../test/test-utils';
import { ProtectedRoute } from './ProtectedRoute';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    resetMockAuth();
  });

  it('shows login page when user is unauthenticated', () => {
    setMockAuthState(null);

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );

    expect(
      screen.getByRole('heading', { name: /mmo admin/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in with google/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows protected content when user is authenticated', () => {
    setMockAuthState(mockUser);

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /sign in with google/i }),
    ).not.toBeInTheDocument();
  });

  it('blocks access to protected content without authentication', () => {
    setMockAuthState(null);

    render(
      <ProtectedRoute>
        <div data-testid="secret-admin-content">Secret Admin Content</div>
      </ProtectedRoute>,
    );

    expect(
      screen.queryByTestId('secret-admin-content'),
    ).not.toBeInTheDocument();
  });
});
