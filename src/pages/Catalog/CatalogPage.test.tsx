import { describe, it, expect } from 'vitest';
import { catalogLabelForType } from '../../lib/catalogRoutes';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { clickCatalogNav, renderCatalogApp } from '../../test/renderCatalogApp';
import { CatalogPage } from './CatalogPage';

describe('CatalogPage', () => {
  it('renders the section heading without catalog type tabs', () => {
    render(<CatalogPage />);

    expect(
      screen.getByRole('heading', { name: catalogLabelForType('class'), level: 1 }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('loads and displays version picker', async () => {
    render(<CatalogPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Classes Version/)).toBeInTheDocument();
    });
  });

  it('loads the latest published class version without a manual selection', async () => {
    render(<CatalogPage />);

    expect(await screen.findByLabelText(/Classes Version/)).toHaveTextContent('v2');
    expect(await screen.findByText('Vanguard')).toBeInTheDocument();
    expect(screen.getByText('Viewing version 2')).toBeInTheDocument();
    expect(screen.queryByText(/Select a version above/)).not.toBeInTheDocument();
  });

  it('loads class list after selecting an older version', async () => {
    const user = userEvent.setup();
    render(<CatalogPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Classes Version/)).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    await user.click(select);

    const option = await screen.findByRole('option', { name: /v1/ });
    await user.click(option);

    await waitFor(() => {
      expect(screen.getByText('Vanguard')).toBeInTheDocument();
      expect(screen.getByText('Viewing version 1')).toBeInTheDocument();
    });
  });

  it('shows class details when class is selected', async () => {
    const user = userEvent.setup();
    render(<CatalogPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Classes Version/)).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    await user.click(select);

    const option = await screen.findByRole('option', { name: /v2/ });
    await user.click(option);

    await waitFor(() => {
      expect(screen.getByText('Vanguard')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Vanguard'));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Vanguard' })).toBeInTheDocument();
      expect(screen.getByText(/stalwart frontline defender/)).toBeInTheDocument();
    });
  });

  it('switches catalog types from the sidebar', async () => {
    const user = userEvent.setup();
    renderCatalogApp();

    await waitFor(() => {
      expect(screen.getByLabelText(/Classes Version/)).toBeInTheDocument();
    });

    await clickCatalogNav(user, 'Skills');

    await waitFor(() => {
      expect(screen.getByLabelText(/Skills Version/)).toBeInTheDocument();
    });
    expect(
      screen.getByRole('heading', { name: catalogLabelForType('skill'), level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('loads skills list after selecting a sidebar section and version', async () => {
    const user = userEvent.setup();
    renderCatalogApp();

    await waitFor(() => {
      expect(screen.getByLabelText(/Classes Version/)).toBeInTheDocument();
    });

    await clickCatalogNav(user, 'Skills');

    await waitFor(() => {
      expect(screen.getByLabelText(/Skills Version/)).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    await user.click(select);

    const option = await screen.findByRole('option', { name: /v1/ });
    await user.click(option);

    await waitFor(() => {
      expect(screen.getByText('Cleaving Strike')).toBeInTheDocument();
    });
  });

  it('loads combat constants after selecting the sidebar section', async () => {
    const user = userEvent.setup();
    renderCatalogApp();

    await clickCatalogNav(user, 'Combat Constants');

    await waitFor(() => {
      expect(screen.getByLabelText(/Combat Constants Version/)).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    await user.click(select);

    const option = await screen.findByRole('option', { name: /v1/ });
    await user.click(option);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: catalogLabelForType('combat-constants'),
          level: 1,
        }),
      ).toBeInTheDocument();
      expect(screen.getByText('Power Scaling')).toBeInTheDocument();
    });
  });
});
