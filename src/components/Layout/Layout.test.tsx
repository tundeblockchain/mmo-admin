import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import { Layout } from './Layout';

describe('Layout', () => {
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
});
