import { describe, expect, it, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  mockSignInWithPopup,
  resetMockAuth,
} from '../../test/mocks/firebase-auth';
import { render } from '../../test/test-utils';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  beforeEach(() => {
    resetMockAuth();
  });

  it('renders sign in button', () => {
    render(<LoginPage />);

    expect(
      screen.getByRole('button', { name: /sign in with google/i }),
    ).toBeInTheDocument();
  });

  it('renders page title', () => {
    render(<LoginPage />);

    expect(
      screen.getByRole('heading', { name: /mmo admin/i }),
    ).toBeInTheDocument();
  });

  it('calls signInWithPopup when sign in button is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const signInButton = screen.getByRole('button', {
      name: /sign in with google/i,
    });
    await user.click(signInButton);

    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalledTimes(1);
    });
  });

  it('shows error message when sign in fails', async () => {
    const user = userEvent.setup();
    mockSignInWithPopup.mockRejectedValueOnce(new Error('Auth failed'));

    render(<LoginPage />);

    const signInButton = screen.getByRole('button', {
      name: /sign in with google/i,
    });
    await user.click(signInButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Auth failed');
    });
  });

  it('disables button while signing in', async () => {
    const user = userEvent.setup();
    let resolveSignIn: () => void = () => {};
    mockSignInWithPopup.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveSignIn = resolve;
        }),
    );

    render(<LoginPage />);

    const signInButton = screen.getByRole('button', {
      name: /sign in with google/i,
    });
    await user.click(signInButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /signing in/i }),
      ).toBeDisabled();
    });

    resolveSignIn();
  });

  it('shows descriptive text about signing in', () => {
    render(<LoginPage />);

    expect(
      screen.getByText(/sign in with your google account/i),
    ).toBeInTheDocument();
  });
});
