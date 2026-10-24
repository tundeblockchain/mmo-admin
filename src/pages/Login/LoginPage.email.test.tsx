import { describe, expect, it, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AUTH_MESSAGES } from '../../auth/authMessages';
import {
  firebaseAuthError,
  mockSignInWithEmailAndPassword,
  resetMockAuth,
} from '../../test/mocks/firebase-auth';
import { render } from '../../test/test-utils';
import { AUTH_TEST_IDS } from './authTestIds';
import { LoginPage } from './LoginPage';

describe('LoginPage email sign-in', () => {
  beforeEach(() => {
    resetMockAuth();
  });

  it('signs in with email and password', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'tester@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'correct-password');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    await waitFor(() => {
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'tester@example.com',
        'correct-password',
      );
    });
  });

  it('shows the same generic error for unknown or wrong credentials', async () => {
    const user = userEvent.setup();
    mockSignInWithEmailAndPassword
      .mockRejectedValueOnce(firebaseAuthError('auth/user-not-found', 'no user'))
      .mockRejectedValueOnce(firebaseAuthError('auth/wrong-password', 'bad pass'))
      .mockRejectedValueOnce(firebaseAuthError('auth/invalid-credential', 'invalid'));

    render(<LoginPage />);

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'tester@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'wrong-password');

    for (let attempt = 0; attempt < 3; attempt += 1) {
      await user.click(screen.getByRole('button', { name: /^sign in$/i }));
      await waitFor(() => {
        expect(screen.getByTestId(AUTH_TEST_IDS.error)).toHaveTextContent(
          AUTH_MESSAGES.invalidCredentials,
        );
      });
      expect(screen.queryByText(/no user|bad pass|invalid/i)).not.toBeInTheDocument();
    }
  });

  it('opens register and forgot-password screens from sign-in', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole('button', { name: /create an account/i }));
    expect(screen.getByTestId(AUTH_TEST_IDS.screenRegister)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /already have an account/i }));
    await user.click(screen.getByRole('button', { name: /forgot password/i }));
    expect(screen.getByTestId(AUTH_TEST_IDS.screenForgotPassword)).toBeInTheDocument();
  });
});
