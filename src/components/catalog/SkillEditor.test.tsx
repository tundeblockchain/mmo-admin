import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import { SkillEditor } from './SkillEditor';
import type { SkillDefinition } from '../../types/catalog';

const mockSkillData: SkillDefinition = {
  skillId: 'vanguard_cleaving_strike',
  classId: 'vanguard',
  displayName: 'Cleaving Strike',
  description: '1.50 P + 0.60 STR, 120° arc.',
  kind: 'active',
  resourceId: null,
  resourceCost: 0,
  cooldownSeconds: 0,
  charges: 1,
  chargeRechargeSeconds: 0,
  castTimeSeconds: 0,
  castableWhileMoving: false,
  range: 0,
  coefficients: {
    basePower: 1.5,
    scaling: [
      { stat: 'attackPower', coefficient: 1.5 },
      { stat: 'strength', coefficient: 0.6 },
    ],
    element: 'physical',
  },
  timing: { castMs: 0, activeMs: 350, recoveryMs: 300 },
  stagger: { staggerPower: 20, canStagger: true },
  pvpMultipliers: { damageMultiplier: 0.8 },
  unlockLevel: 1,
  iconPath: 'icons/skills/vanguard/cleaving_strike.png',
};

describe('SkillEditor', () => {
  it('renders with skill data and shows all accessible fields', () => {
    const onUpdate = vi.fn();
    render(<SkillEditor skillData={mockSkillData} onUpdate={onUpdate} />);

    expect(screen.getByRole('heading', { name: 'Skill Editor' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Display Name' })).toHaveValue('Cleaving Strike');
    expect(screen.getByRole('textbox', { name: 'Description' })).toBeInTheDocument();
  });

  it('calls onUpdate when display name is changed', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<SkillEditor skillData={mockSkillData} onUpdate={onUpdate} />);

    const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
    await user.type(displayNameInput, ' X');

    expect(onUpdate).toHaveBeenCalled();
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.displayName).toContain('Cleaving Strike');
    expect(lastCall.skillId).toBe('vanguard_cleaving_strike');
  });

  it('calls onUpdate when timing field is changed', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<SkillEditor skillData={mockSkillData} onUpdate={onUpdate} />);

    const timingAccordion = screen.getByRole('button', { name: /timing/i });
    await user.click(timingAccordion);

    const castMsInput = screen.getByRole('spinbutton', { name: 'Cast (ms)' });
    await user.type(castMsInput, '5');

    expect(onUpdate).toHaveBeenCalled();
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.timing?.castMs).toBe(5);
  });

  it('displays PvP multipliers as percentages and stores as decimals', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<SkillEditor skillData={mockSkillData} onUpdate={onUpdate} />);

    const pvpAccordion = screen.getByRole('button', { name: /pvp multipliers/i });
    await user.click(pvpAccordion);

    const damageMultiplierInput = screen.getByRole('spinbutton', {
      name: 'Damage Multiplier (%)',
    });
    expect(damageMultiplierInput).toHaveValue(80);

    await user.type(damageMultiplierInput, '5');

    expect(onUpdate).toHaveBeenCalled();
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(typeof lastCall.pvpMultipliers?.damageMultiplier).toBe('number');
    expect(lastCall.pvpMultipliers?.damageMultiplier).toBeGreaterThan(0);
  });

  it('preserves unchanged fields when updating', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<SkillEditor skillData={mockSkillData} onUpdate={onUpdate} />);

    const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
    await user.type(displayNameInput, ' X');

    expect(onUpdate).toHaveBeenCalled();
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.skillId).toBe(mockSkillData.skillId);
    expect(lastCall.classId).toBe(mockSkillData.classId);
    expect(lastCall.coefficients.basePower).toBe(mockSkillData.coefficients.basePower);
    expect(lastCall.stagger?.staggerPower).toBe(mockSkillData.stagger?.staggerPower);
  });
});
