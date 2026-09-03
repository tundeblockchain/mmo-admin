import { describe, expect, it, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  mockUser,
  mockSignOut,
  setMockAuthState,
  resetMockAuth,
} from '../../test/mocks/firebase-auth';
import { render } from '../../test/test-utils';
import { Layout } from './Layout';

describe('Layout', () => {
  beforeEach(() => {
    resetMockAuth();
    setMockAuthState(mockUser);
  });

  it('renders the app bar with title', () => {
    render(<Layout />);

    expect(
      screen.getByRole('heading', { name: /mmo admin/i }),
    ).toBeInTheDocument();
  });

  it('renders navigation with Home and Catalog links', () => {
    render(<Layout />);

    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /catalog/i })).toBeInTheDocument();
  });

  it('navigates to catalog when catalog link is clicked', async () => {
    const user = userEvent.setup();
    render(<Layout />);

    const catalogLink = screen.getByRole('link', { name: /catalog/i });
    await user.click(catalogLink);

    expect(catalogLink).toHaveAttribute('href', '/catalog');
  });

  it('has accessible navigation structure', () => {
    render(<Layout />);

    const appBar = screen.getByRole('banner');
    expect(appBar).toBeInTheDocument();

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('shows user avatar when authenticated', () => {
    render(<Layout />);

    expect(
      screen.getByRole('button', { name: /account menu/i }),
    ).toBeInTheDocument();
  });

  it('opens account menu when avatar is clicked', async () => {
    const user = userEvent.setup();
    render(<Layout />);

    const avatarButton = screen.getByRole('button', { name: /account menu/i });
    await user.click(avatarButton);

    expect(screen.getByText(mockUser.displayName!)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign out/i }),
    ).toBeInTheDocument();
  });

  it('calls signOut when sign out button is clicked', async () => {
    const user = userEvent.setup();
    render(<Layout />);

    const avatarButton = screen.getByRole('button', { name: /account menu/i });
    await user.click(avatarButton);

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    await user.click(signOutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });
});
