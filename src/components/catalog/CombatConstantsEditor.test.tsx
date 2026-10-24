import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import { CombatConstantsEditor } from './CombatConstantsEditor';
import type { CombatConstantsData } from '../../types/catalog';

const mockConstants: CombatConstantsData = {
  powerScaling: {
    physicalPower: { strengthMultiplier: 2, levelMultiplier: 1.5 },
    spellPower: { intellectMultiplier: 2, levelMultiplier: 1 },
    techPower: { techMultiplier: 2, levelMultiplier: 1 },
    devicePower: { techDivisor: 100 },
  },
  critical: {
    baseCritChance: 0.05,
    critChance: { luckConstant: 500, maxLuckCritBonus: 0.3 },
    procChance: { luckDivisor: 500 },
    criticalDamageMultiplier: 1.5,
  },
  defense: {
    defenseConstant: { baseConstant: 200, levelMultiplier: 15 },
    armorReductionPerPoint: 0.001,
    maxArmorReduction: 0.75,
    blockDamageReduction: 0.5,
  },
  statCaps: {
    softCap: 100,
    hardCap: 150,
    softCapPenalty: 0.5,
  },
  dodge: {
    baseDodgeChance: 0.02,
    maxDodgeChance: 0.4,
  },
};

function mountEditableConstants(
  initial: CombatConstantsData,
  fieldErrors?: Record<string, string>,
) {
  const onUpdate = vi.fn();

  function Harness() {
    const [data, setData] = useState(initial);
    return (
      <CombatConstantsEditor
        data={data}
        onUpdate={(updated) => {
          setData(updated);
          onUpdate(updated);
        }}
        fieldErrors={fieldErrors}
      />
    );
  }

  render(<Harness />);
  return { onUpdate };
}

describe('CombatConstantsEditor', () => {
  it('updates stat caps on the draft working copy as schema types', async () => {
    const user = userEvent.setup();
    const { onUpdate } = mountEditableConstants(mockConstants);

    await user.click(screen.getByRole('button', { name: /stat caps/i }));
    const hardCap = screen.getByRole('spinbutton', { name: 'Hard Cap' });
    expect(hardCap).toHaveValue(150);
    await user.clear(hardCap);
    await user.type(hardCap, '160');

    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0] as CombatConstantsData;
    expect(lastCall.statCaps).toEqual({
      softCap: 100,
      hardCap: 160,
      softCapPenalty: 0.5,
    });
  });

  it('displays dodge chances as percents and stores decimals', async () => {
    const user = userEvent.setup();
    const { onUpdate } = mountEditableConstants(mockConstants);

    await user.click(screen.getByRole('button', { name: /^dodge$/i }));
    const maxDodge = screen.getByRole('spinbutton', { name: 'Max Dodge Chance (%)' });
    expect(maxDodge).toHaveValue(40);
    await user.clear(maxDodge);
    await user.type(maxDodge, '45');

    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0] as CombatConstantsData;
    expect(lastCall.dodge?.maxDodgeChance).toBe(0.45);
    expect(lastCall.dodge?.baseDodgeChance).toBe(0.02);
  });

  it('shows integer validation next to stat caps', async () => {
    const user = userEvent.setup();
    render(
      <CombatConstantsEditor
        data={{ ...mockConstants, statCaps: { ...mockConstants.statCaps, softCap: 100.5 } }}
        onUpdate={vi.fn()}
        fieldErrors={{ 'statCaps.softCap': 'Must be an integer' }}
      />,
    );

    await user.click(screen.getByRole('button', { name: /stat caps/i }));
    expect(screen.getByRole('spinbutton', { name: 'Soft Cap' })).toHaveAccessibleDescription(
      'Must be an integer',
    );
  });
});
