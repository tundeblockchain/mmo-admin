import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { clickCatalogNav, renderCatalogApp } from '../../test/renderCatalogApp';
import { CatalogPage } from './CatalogPage';

describe('CatalogPage', () => {
  it('renders page header without catalog type tabs', () => {
    render(<CatalogPage />);

    expect(screen.getByRole('heading', { name: 'Catalog' })).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('loads and displays version picker', async () => {
    render(<CatalogPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Classes Version/)).toBeInTheDocument();
    });
  });

  it('shows prompt to select version when none selected', async () => {
    render(<CatalogPage />);

    await waitFor(() => {
      expect(screen.getByText(/Select a version above/)).toBeInTheDocument();
    });
  });

  it('loads class list after selecting version', async () => {
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
      expect(screen.getByRole('heading', { name: 'Combat Constants' })).toBeInTheDocument();
      expect(screen.getByText('Power Scaling')).toBeInTheDocument();
    });
  });
});
