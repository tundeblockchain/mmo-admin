import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import { ResonanceEditor } from './ResonanceEditor';
import type { ResonanceDefinition } from '../../types/catalog';

const mockResonanceData: ResonanceDefinition = {
  resonanceId: 'valor',
  displayName: 'Valor',
  description: 'The resonance of the Vanguard.',
  partyBonus: [
    { stat: 'hp', bonusPercent: 0.1 },
    { stat: 'armor', bonusPercent: 0.08 },
  ],
};

describe('ResonanceEditor', () => {
  it('renders with resonance data and shows all accessible fields', () => {
    const onUpdate = vi.fn();
    render(<ResonanceEditor resonanceData={mockResonanceData} onUpdate={onUpdate} />);

    expect(screen.getByRole('heading', { name: 'Resonance Editor' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Display Name' })).toHaveValue('Valor');
    expect(screen.getByRole('textbox', { name: 'Description' })).toHaveValue(
      'The resonance of the Vanguard.',
    );
  });

  it('calls onUpdate when display name is changed', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<ResonanceEditor resonanceData={mockResonanceData} onUpdate={onUpdate} />);

    const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
    await user.type(displayNameInput, ' X');

    expect(onUpdate).toHaveBeenCalled();
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.displayName).toContain('Valor');
    expect(lastCall.resonanceId).toBe('valor');
  });

  it('displays party bonus percentages and stores as decimals', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<ResonanceEditor resonanceData={mockResonanceData} onUpdate={onUpdate} />);

    const spinbuttons = screen.getAllByRole('spinbutton');
    const hpBonusInput = spinbuttons.find((input) =>
      input.closest('tr')?.querySelector('input')?.value === 'hp',
    );

    expect(hpBonusInput).toBeDefined();
    if (hpBonusInput) {
      expect(hpBonusInput).toHaveValue(10);

      await user.type(hpBonusInput, '5');

      expect(onUpdate).toHaveBeenCalled();
      const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
      expect(lastCall.partyBonus[0].bonusPercent).toBe(1.05);
    }
  });

  it('allows changing party bonus stat name', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<ResonanceEditor resonanceData={mockResonanceData} onUpdate={onUpdate} />);

    const statInputs = screen.getAllByPlaceholderText('e.g., attackPower');
    expect(statInputs.length).toBe(2);

    const hpStatInput = statInputs[0];
    await user.type(hpStatInput, 'Max');

    expect(onUpdate).toHaveBeenCalled();
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.partyBonus[0].stat).toContain('hp');
  });

  it('preserves unchanged fields when updating', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<ResonanceEditor resonanceData={mockResonanceData} onUpdate={onUpdate} />);

    const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
    await user.type(displayNameInput, ' X');

    expect(onUpdate).toHaveBeenCalled();
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.resonanceId).toBe(mockResonanceData.resonanceId);
    expect(lastCall.partyBonus).toHaveLength(2);
    expect(lastCall.partyBonus[0].bonusPercent).toBe(mockResonanceData.partyBonus[0].bonusPercent);
    expect(lastCall.partyBonus[1].stat).toBe(mockResonanceData.partyBonus[1].stat);
  });
});
