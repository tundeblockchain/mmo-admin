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
import { colors } from '../../theme';
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

  it('renders Home and nested Catalog section links', () => {
    render(<Layout />);

    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Catalog' })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Classes' })).toHaveAttribute(
      'href',
      '/catalog/classes',
    );
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute(
      'href',
      '/catalog/skills',
    );
    expect(screen.getByRole('link', { name: 'Combat Constants' })).toHaveAttribute(
      'href',
      '/catalog/combat-constants',
    );
    expect(screen.getByRole('link', { name: 'Statuses' })).toHaveAttribute(
      'href',
      '/catalog/statuses',
    );
    expect(screen.getByRole('link', { name: 'Elements' })).toHaveAttribute(
      'href',
      '/catalog/elements',
    );
    expect(screen.getByRole('link', { name: 'Resonance' })).toHaveAttribute(
      'href',
      '/catalog/resonance',
    );
  });

  it('highlights the active catalog section', () => {
    render(<Layout />, { initialEntries: ['/catalog/skills'] });

    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Classes' })).not.toHaveAttribute(
      'aria-current',
    );
    expect(screen.getByRole('link', { name: /home/i })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('has accessible navigation structure', () => {
    render(<Layout />);

    const appBar = screen.getByRole('banner');
    expect(appBar).toBeInTheDocument();

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('renders a theme toggle in the app bar', () => {
    render(<Layout />);

    const toggle = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(toggle).toBeInTheDocument();
    expect(screen.getByRole('banner')).toContainElement(toggle);
  });

  it('uses the theme sidebar colour for the drawer', async () => {
    const user = userEvent.setup();
    render(<Layout />);

    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar).toHaveStyle({
      backgroundColor: colors.light.sidebar.background,
    });

    await user.click(screen.getByRole('button', { name: /switch to dark mode/i }));

    expect(screen.getByLabelText('Sidebar')).toHaveStyle({
      backgroundColor: colors.dark.sidebar.background,
    });
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
