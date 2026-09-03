import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import { ElementEditor } from './ElementEditor';
import type { ElementDefinition } from '../../types/catalog';

const mockElementData: ElementDefinition = {
  elementId: 'fire',
  displayName: 'Fire',
  color: '#FF4500',
  strongAgainst: { ice: 1.25, nature: 1.25 },
  weakAgainst: { fire: 0.5 },
};

describe('ElementEditor', () => {
  it('renders with element data and shows all accessible fields', () => {
    const onUpdate = vi.fn();
    render(<ElementEditor elementData={mockElementData} onUpdate={onUpdate} />);

    expect(screen.getByRole('heading', { name: 'Element Editor' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Display Name' })).toHaveValue('Fire');
    expect(screen.getByRole('textbox', { name: /color/i })).toHaveValue('#FF4500');
  });

  it('calls onUpdate when display name is changed', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<ElementEditor elementData={mockElementData} onUpdate={onUpdate} />);

    const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
    await user.type(displayNameInput, ' X');

    expect(onUpdate).toHaveBeenCalled();
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.displayName).toContain('Fire');
    expect(lastCall.elementId).toBe('fire');
  });

  it('displays strength multipliers as percentages and stores as decimals', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<ElementEditor elementData={mockElementData} onUpdate={onUpdate} />);

    const iceMultiplierInputs = screen.getAllByRole('spinbutton');
    const iceStrongInput = iceMultiplierInputs.find((input) =>
      input.closest('tr')?.textContent?.includes('ice'),
    );

    expect(iceStrongInput).toBeDefined();
    if (iceStrongInput) {
      expect(iceStrongInput).toHaveValue(125);

      await user.type(iceStrongInput, '0');

      expect(onUpdate).toHaveBeenCalled();
      const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
      expect(lastCall.strongAgainst.ice).toBe(12.5);
    }
  });

  it('removes multiplier when set to zero via clear', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const elementWithMultiplier = {
      ...mockElementData,
      strongAgainst: { nature: 1.25 },
    };
    render(<ElementEditor elementData={elementWithMultiplier} onUpdate={onUpdate} />);

    const spinbuttons = screen.getAllByRole('spinbutton');
    const natureStrongInput = spinbuttons.find(
      (input) =>
        input.closest('tr')?.textContent?.includes('nature') &&
        input.closest('table')?.closest('div')?.textContent?.includes('Strong Against'),
    );

    expect(natureStrongInput).toBeDefined();
    if (natureStrongInput) {
      await user.clear(natureStrongInput);

      expect(onUpdate).toHaveBeenCalled();
      const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
      expect(lastCall.strongAgainst.nature).toBeUndefined();
    }
  });

  it('preserves unchanged fields when updating', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<ElementEditor elementData={mockElementData} onUpdate={onUpdate} />);

    const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
    await user.type(displayNameInput, ' X');

    expect(onUpdate).toHaveBeenCalled();
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.elementId).toBe(mockElementData.elementId);
    expect(lastCall.color).toBe(mockElementData.color);
    expect(lastCall.strongAgainst.ice).toBe(mockElementData.strongAgainst.ice);
    expect(lastCall.weakAgainst.fire).toBe(mockElementData.weakAgainst.fire);
  });
});
