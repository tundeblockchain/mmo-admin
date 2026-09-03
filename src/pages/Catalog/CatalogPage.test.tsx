import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { CatalogPage } from './CatalogPage';

describe('CatalogPage', () => {
  it('renders page header', () => {
    render(<CatalogPage />);

    expect(screen.getByRole('heading', { name: 'Catalog' })).toBeInTheDocument();
  });

  it('renders catalog type navigation tabs', () => {
    render(<CatalogPage />);

    expect(screen.getByRole('tab', { name: 'Classes' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Skills' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Combat Constants' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Statuses' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Elements' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Resonance' })).toBeInTheDocument();
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

  it('switches between catalog types', async () => {
    const user = userEvent.setup();
    render(<CatalogPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Classes Version/)).toBeInTheDocument();
    });

    const skillsTab = screen.getByRole('tab', { name: 'Skills' });
    await user.click(skillsTab);

    await waitFor(() => {
      expect(screen.getByLabelText(/Skills Version/)).toBeInTheDocument();
    });
  });

  it('loads skills list after selecting version on Skills tab', async () => {
    const user = userEvent.setup();
    render(<CatalogPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Classes Version/)).toBeInTheDocument();
    });

    const skillsTab = screen.getByRole('tab', { name: 'Skills' });
    await user.click(skillsTab);

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

  it('loads combat constants after selecting version', async () => {
    const user = userEvent.setup();
    render(<CatalogPage />);

    const combatTab = screen.getByRole('tab', { name: 'Combat Constants' });
    await user.click(combatTab);

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
