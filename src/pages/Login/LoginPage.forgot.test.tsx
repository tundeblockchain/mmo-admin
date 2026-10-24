import { describe, expect, it, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AUTH_MESSAGES } from '../../auth/authMessages';
import {
  firebaseAuthError,
  mockSendPasswordResetEmail,
  resetMockAuth,
} from '../../test/mocks/firebase-auth';
import { render } from '../../test/test-utils';
import { AUTH_TEST_IDS } from './authTestIds';
import { LoginPage } from './LoginPage';

async function openForgotPassword(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /forgot password/i }));
}

describe('LoginPage forgot password', () => {
  beforeEach(() => {
    resetMockAuth();
  });

  it('sends a reset email and always shows the same success message', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    await openForgotPassword(user);

    await user.type(screen.getByLabelText(/^email$/i), 'tester@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(
        expect.anything(),
        'tester@example.com',
      );
      expect(screen.getByTestId(AUTH_TEST_IDS.success)).toHaveTextContent(
        AUTH_MESSAGES.resetSent,
      );
    });
  });

  it('shows the same success message when Firebase says the email is unknown', async () => {
    const user = userEvent.setup();
    mockSendPasswordResetEmail.mockRejectedValueOnce(
      firebaseAuthError('auth/user-not-found', 'no user'),
    );

    render(<LoginPage />);
    await openForgotPassword(user);

    await user.type(screen.getByLabelText(/^email$/i), 'unknown@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByTestId(AUTH_TEST_IDS.success)).toHaveTextContent(
        AUTH_MESSAGES.resetSent,
      );
    });
    expect(screen.queryByRole('alert', { name: /no user/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/no user|not found/i)).not.toBeInTheDocument();
  });
});
