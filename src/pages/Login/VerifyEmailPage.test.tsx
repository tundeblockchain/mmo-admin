import { describe, expect, it, beforeEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AUTH_MESSAGES } from '../../auth/authMessages';
import { server } from '../../test/mocks/server';
import {
  mockSendEmailVerification,
  mockUnverifiedUser,
  resetMockAuth,
  setMockAuthState,
} from '../../test/mocks/firebase-auth';
import { render } from '../../test/test-utils';
import { AUTH_TEST_IDS } from './authTestIds';
import { VerifyEmailPage } from './VerifyEmailPage';

describe('VerifyEmailPage', () => {
  beforeEach(() => {
    resetMockAuth();
    setMockAuthState(mockUnverifiedUser);
  });

  it('resends the verification email', async () => {
    const user = userEvent.setup();
    render(<VerifyEmailPage />);

    await user.click(
      screen.getByRole('button', { name: /resend verification email/i }),
    );

    await waitFor(() => {
      expect(mockSendEmailVerification).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId(AUTH_TEST_IDS.success)).toHaveTextContent(
        AUTH_MESSAGES.verifyResent,
      );
    });
  });

  it('refreshes the token and re-POSTs /users/me after the user verifies', async () => {
    const user = userEvent.setup();
    const order: string[] = [];
    vi.mocked(mockUnverifiedUser.reload).mockImplementation(async () => {
      mockUnverifiedUser.emailVerified = true;
      order.push('reload');
    });
    vi.mocked(mockUnverifiedUser.getIdToken).mockImplementation(async (force) => {
      order.push(force === true ? 'refresh' : 'token');
      return 'mock-id-token';
    });

    server.use(
      http.post('*/users/me', () => {
        order.push('post');
        return HttpResponse.json({ uid: 'test-uid-123', accountType: 'admin' });
      }),
    );

    render(<VerifyEmailPage />);
    await user.click(screen.getByRole('button', { name: /i've verified my email/i }));

    await waitFor(() => {
      expect(order).toEqual(['reload', 'refresh', 'token', 'post']);
    });
  });

  it('stays on the verify screen when the email is still unverified', async () => {
    const user = userEvent.setup();
    let posts = 0;
    server.use(
      http.post('*/users/me', () => {
        posts += 1;
        return HttpResponse.json({ uid: 'test-uid-123', accountType: 'admin' });
      }),
    );

    render(<VerifyEmailPage />);
    await user.click(screen.getByRole('button', { name: /i've verified my email/i }));

    await waitFor(() => {
      expect(screen.getByTestId(AUTH_TEST_IDS.error)).toHaveTextContent(
        AUTH_MESSAGES.stillUnverified,
      );
    });
    expect(screen.getByTestId(AUTH_TEST_IDS.screenVerifyEmail)).toBeInTheDocument();
    expect(posts).toBe(0);
  });
});
