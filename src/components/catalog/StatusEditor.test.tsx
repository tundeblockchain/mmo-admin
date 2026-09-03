import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import { StatusEditor } from './StatusEditor';
import type { StatusDefinition } from '../../types/catalog';

const mockStatusData: StatusDefinition = {
  statusId: 'flame',
  displayName: 'Flame',
  description: 'Burning from fire damage.',
  category: 'dot',
  maxStacks: 3,
  dispellable: true,
  persistsThroughDeath: false,
  iconPath: 'icons/statuses/flame.png',
};

describe('StatusEditor', () => {
  it('renders with status data and shows all accessible fields', () => {
    const onUpdate = vi.fn();
    render(<StatusEditor statusData={mockStatusData} onUpdate={onUpdate} />);

    expect(screen.getByRole('heading', { name: 'Status Editor' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Display Name' })).toHaveValue('Flame');
    expect(screen.getByRole('textbox', { name: 'Description' })).toHaveValue(
      'Burning from fire damage.',
    );
  });

  it('calls onUpdate when display name is changed', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<StatusEditor statusData={mockStatusData} onUpdate={onUpdate} />);

    const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
    await user.type(displayNameInput, ' X');

    expect(onUpdate).toHaveBeenCalled();
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.displayName).toContain('Flame');
    expect(lastCall.statusId).toBe('flame');
  });

  it('calls onUpdate when max stacks is changed', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<StatusEditor statusData={mockStatusData} onUpdate={onUpdate} />);

    const maxStacksInput = screen.getByRole('spinbutton', { name: 'Max Stacks' });
    await user.type(maxStacksInput, '5');

    expect(onUpdate).toHaveBeenCalled();
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.maxStacks).toBe(35);
  });

  it('calls onUpdate when dispellable checkbox is toggled', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<StatusEditor statusData={mockStatusData} onUpdate={onUpdate} />);

    const dispellableCheckbox = screen.getByRole('checkbox', { name: 'Dispellable' });
    expect(dispellableCheckbox).toBeChecked();

    await user.click(dispellableCheckbox);

    expect(onUpdate).toHaveBeenCalled();
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.dispellable).toBe(false);
  });

  it('calls onUpdate when persistsThroughDeath checkbox is toggled', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<StatusEditor statusData={mockStatusData} onUpdate={onUpdate} />);

    const persistsCheckbox = screen.getByRole('checkbox', { name: 'Persists Through Death' });
    expect(persistsCheckbox).not.toBeChecked();

    await user.click(persistsCheckbox);

    expect(onUpdate).toHaveBeenCalled();
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.persistsThroughDeath).toBe(true);
  });

  it('preserves unchanged fields when updating', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<StatusEditor statusData={mockStatusData} onUpdate={onUpdate} />);

    const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
    await user.type(displayNameInput, ' X');

    expect(onUpdate).toHaveBeenCalled();
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.statusId).toBe(mockStatusData.statusId);
    expect(lastCall.category).toBe(mockStatusData.category);
    expect(lastCall.maxStacks).toBe(mockStatusData.maxStacks);
    expect(lastCall.iconPath).toBe(mockStatusData.iconPath);
  });
});
