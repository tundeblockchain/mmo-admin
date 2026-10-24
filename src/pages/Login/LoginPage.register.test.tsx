import { describe, expect, it, beforeEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AUTH_MESSAGES } from '../../auth/authMessages';
import { server } from '../../test/mocks/server';
import {
  firebaseAuthError,
  mockCreateUserWithEmailAndPassword,
  mockSendEmailVerification,
  mockUnverifiedUser,
  resetMockAuth,
  setMockAuthState,
} from '../../test/mocks/firebase-auth';
import { render } from '../../test/test-utils';
import { AUTH_TEST_IDS } from './authTestIds';
import { LoginPage } from './LoginPage';

async function openRegister(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /create an account/i }));
}

describe('LoginPage register', () => {
  beforeEach(() => {
    resetMockAuth();
    setMockAuthState(null);
  });

  it('creates an account and sends a verification email', async () => {
    const user = userEvent.setup();
    const createdUser = { uid: 'new-user', emailVerified: false };
    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({ user: createdUser });

    render(<LoginPage />);
    await openRegister(user);

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'new.user@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'secure-pass');
    await user.type(screen.getByLabelText(/confirm password/i), 'secure-pass');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'new.user@example.com',
        'secure-pass',
      );
      expect(mockSendEmailVerification).toHaveBeenCalledWith(createdUser);
    });
  });

  it('provisions a new account as player after sending verification', async () => {
    const user = userEvent.setup();
    const order: string[] = [];
    let capturedBody: unknown = null;

    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({
      user: mockUnverifiedUser,
    });
    vi.mocked(mockUnverifiedUser.getIdToken).mockImplementation(async (force) => {
      order.push(force === true ? 'refresh' : 'token');
      return 'mock-id-token';
    });
    mockSendEmailVerification.mockImplementation(async () => {
      order.push('verify');
    });

    server.use(
      http.post('*/users/me', async ({ request }) => {
        const text = await request.text();
        capturedBody = text ? JSON.parse(text) : {};
        order.push('post');
        return HttpResponse.json({ uid: 'test-uid-123', accountType: 'player' });
      }),
    );

    render(<LoginPage />);
    await openRegister(user);

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'new.user@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'secure-pass');
    await user.type(screen.getByLabelText(/confirm password/i), 'secure-pass');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(order).toEqual(['verify', 'refresh', 'token', 'post']);
    });
    expect(capturedBody).not.toEqual(expect.objectContaining({ accountType: 'admin' }));
  });

  it('does not reveal that an email is already registered', async () => {
    const user = userEvent.setup();
    mockCreateUserWithEmailAndPassword.mockRejectedValueOnce(
      firebaseAuthError('auth/email-already-in-use', 'email exists'),
    );

    render(<LoginPage />);
    await openRegister(user);

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'taken@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'secure-pass');
    await user.type(screen.getByLabelText(/confirm password/i), 'secure-pass');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByTestId(AUTH_TEST_IDS.error)).toHaveTextContent(
        AUTH_MESSAGES.genericRegister,
      );
    });
    expect(screen.queryByText(/email exists|already in use/i)).not.toBeInTheDocument();
  });

  it('validates password confirmation before calling Firebase', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    await openRegister(user);

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'new.user@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'secure-pass');
    await user.type(screen.getByLabelText(/confirm password/i), 'other-pass');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(AUTH_MESSAGES.passwordMismatch);
    expect(mockCreateUserWithEmailAndPassword).not.toHaveBeenCalled();
  });
});
