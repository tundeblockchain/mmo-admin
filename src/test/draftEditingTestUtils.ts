import { expect } from 'vitest';
import { type userEvent, screen, waitFor } from './test-utils';

export async function enterClassDraft(user: ReturnType<typeof userEvent.setup>) {
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

  await user.click(screen.getByRole('button', { name: /edit as draft/i }));

  await waitFor(() => {
    expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
  });
}
