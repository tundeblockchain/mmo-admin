import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('boots and renders the admin shell', async () => {
    render(<App />);

    expect(
      await screen.findByRole('heading', { name: /mmo admin/i }),
    ).toBeInTheDocument();
  });

  it('renders the home page by default', async () => {
    render(<App />);

    expect(
      await screen.findByRole('heading', { name: /dashboard/i }),
    ).toBeInTheDocument();
  });
});
