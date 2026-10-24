import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import { PublishDialog } from './PublishDialog';
import type { ClassDefinition } from '../../types/catalog';
import { mockClassData, publishDialogDefaultProps } from '../../test/publishDialogTestUtils';

describe('PublishDialog', () => {
  const defaultProps = publishDialogDefaultProps();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows added entities count', () => {
    const dataWithAddition: ClassDefinition[] = [
      ...mockClassData,
      {
        classId: 'ranger',
        displayName: 'Ranger',
        description: 'A precise marksman.',
        primaryResource: 'focus',
        startingStats: {
          strength: 6,
          finesse: 11,
          vitality: 6,
          intellect: 4,
          precision: 13,
          luck: 7,
          tech: 3,
          hp: 100,
          resourcePool: 100,
          armor: 8,
          attackPower: 14,
          spellPower: 9,
          movementSpeed: 5.5,
        },
        resonance: 'precision',
        roles: ['dps'],
      },
    ];

    render(<PublishDialog {...defaultProps} draftData={dataWithAddition} />);

    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.getByText('1 entities')).toBeInTheDocument();
  });
  it('shows removed entities count', () => {
    render(<PublishDialog {...defaultProps} draftData={[]} />);

    expect(screen.getByText('Removed')).toBeInTheDocument();
    expect(screen.getByText('1 entities')).toBeInTheDocument();
  });
  it('blocks confirm publish for an empty array draft until wipe is acknowledged', async () => {
    const user = userEvent.setup();
    const onPublish = vi.fn().mockResolvedValue(undefined);

    render(
      <PublishDialog {...defaultProps} draftData={[]} onPublish={onPublish} />,
    );

    expect(
      screen.getByText(/this will publish an empty class catalog and remove all entries/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /review & publish/i }));

    const confirmButton = screen.getByRole('button', { name: /confirm publish/i });
    expect(confirmButton).toBeDisabled();

    await user.click(
      screen.getByRole('checkbox', {
        name: /i understand this will remove all class entries/i,
      }),
    );

    expect(confirmButton).toBeEnabled();
    await user.click(confirmButton);
    expect(onPublish).toHaveBeenCalledTimes(1);
  });
  it('does not require extra confirmation for a non-empty publish', async () => {
    const user = userEvent.setup();
    const modifiedData = mockClassData.map((c) => ({
      ...c,
      displayName: 'Modified Vanguard',
    }));

    render(<PublishDialog {...defaultProps} draftData={modifiedData} />);

    expect(
      screen.queryByText(/this will publish an empty class catalog and remove all entries/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('checkbox', {
        name: /i understand this will remove all class entries/i,
      }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /review & publish/i }));

    expect(screen.getByRole('button', { name: /confirm publish/i })).toBeEnabled();
  });
  it('does not treat combat-constants as an empty array wipe', async () => {
    const user = userEvent.setup();
    const originalCombat = {
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
    };
    const draftCombat = {
      ...originalCombat,
      critical: { ...originalCombat.critical, baseCritChance: 0.1 },
    };

    render(
      <PublishDialog
        {...defaultProps}
        catalogType="combat-constants"
        originalData={originalCombat}
        draftData={draftCombat}
      />,
    );

    expect(screen.queryByText(/remove all entries/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /review & publish/i }));
    expect(screen.getByRole('button', { name: /confirm publish/i })).toBeEnabled();
  });
  it('shows added and removed counts together', () => {
    const replaced: ClassDefinition[] = [
      {
        ...mockClassData[0],
        classId: 'warden',
        displayName: 'Warden',
      },
    ];

    render(<PublishDialog {...defaultProps} draftData={replaced} />);

    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.getByText('Removed')).toBeInTheDocument();
    expect(screen.getAllByText('1 entities')).toHaveLength(2);
  });
});
