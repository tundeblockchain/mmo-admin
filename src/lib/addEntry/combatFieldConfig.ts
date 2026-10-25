import type { AddEntryConfig } from './types';

export const COMBAT_CONSTANTS_ADD_ENTRY_CONFIG: AddEntryConfig = {
  catalogType: 'combat-constants',
  title: 'Add Combat Constants',
  entityLabel: 'Combat Constants',
  fields: [
    {
      key: 'powerScaling.physicalPower.strengthMultiplier',
      label: 'Physical Strength Multiplier',
      kind: 'number',
      step: 0.1,
    },
    {
      key: 'critical.baseCritChance',
      label: 'Base Crit Chance',
      kind: 'number',
      step: 0.01,
    },
    {
      key: 'defense.maxArmorReduction',
      label: 'Max Armor Reduction',
      kind: 'number',
      step: 0.01,
    },
  ],
};
