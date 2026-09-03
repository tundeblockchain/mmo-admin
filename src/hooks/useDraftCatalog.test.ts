import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useDraft,
  useCreateDraft,
  useDiscardDraft,
  createDraft,
  updateDraft,
  discardDraft,
  clearDraftStoreForTesting,
} from './useDraftCatalog';
import type { ClassDefinition, CombatConstantsData } from '../types/catalog';

const mockClassData: ClassDefinition[] = [
  {
    classId: 'vanguard',
    displayName: 'Vanguard',
    description: 'A stalwart frontline defender.',
    primaryResource: 'resolve',
    startingStats: {
      strength: 12,
      finesse: 7,
      vitality: 12,
      intellect: 4,
      precision: 6,
      luck: 5,
      tech: 4,
      hp: 150,
      resourcePool: 100,
      armor: 20,
      attackPower: 26,
      spellPower: 9,
      movementSpeed: 5.0,
    },
    resonance: 'valor',
    roles: ['tank', 'dps'],
  },
];

const mockCombatConstants: CombatConstantsData = {
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

describe('useDraftCatalog', () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
  });

  describe('createDraft', () => {
    it('creates a draft for class catalog', () => {
      const { result } = renderHook(() => useDraft('class'));

      expect(result.current).toBeNull();

      act(() => {
        createDraft('class', 1, mockClassData);
      });

      expect(result.current).not.toBeNull();
      expect(result.current?.catalogType).toBe('class');
      expect(result.current?.sourceVersion).toBe(1);
      expect(result.current?.isDirty).toBe(false);
      expect(result.current?.data).toEqual(mockClassData);
    });

    it('creates a deep clone of the data', () => {
      act(() => {
        createDraft('class', 1, mockClassData);
      });

      const { result } = renderHook(() => useDraft('class'));
      const draftData = result.current?.data as ClassDefinition[];

      expect(draftData).not.toBe(mockClassData);
      expect(draftData[0]).not.toBe(mockClassData[0]);
    });

    it('creates separate drafts for different catalog types', () => {
      act(() => {
        createDraft('class', 1, mockClassData);
        createDraft('combat-constants', 2, mockCombatConstants);
      });

      const { result: classResult } = renderHook(() => useDraft('class'));
      const { result: combatResult } = renderHook(() => useDraft('combat-constants'));

      expect(classResult.current?.sourceVersion).toBe(1);
      expect(combatResult.current?.sourceVersion).toBe(2);
    });
  });

  describe('updateDraft', () => {
    it('updates draft data and marks as dirty', () => {
      act(() => {
        createDraft('class', 1, mockClassData);
      });

      const { result } = renderHook(() => useDraft('class'));
      expect(result.current?.isDirty).toBe(false);

      const modifiedData = mockClassData.map((c) => ({
        ...c,
        displayName: 'Modified Vanguard',
      }));

      act(() => {
        updateDraft('class', modifiedData);
      });

      expect(result.current?.isDirty).toBe(true);
      expect((result.current?.data as ClassDefinition[])[0].displayName).toBe('Modified Vanguard');
    });

    it('does nothing if no draft exists', () => {
      const { result } = renderHook(() => useDraft('class'));

      act(() => {
        updateDraft('class', mockClassData);
      });

      expect(result.current).toBeNull();
    });
  });

  describe('discardDraft', () => {
    it('removes the draft', () => {
      act(() => {
        createDraft('class', 1, mockClassData);
      });

      const { result } = renderHook(() => useDraft('class'));
      expect(result.current).not.toBeNull();

      act(() => {
        discardDraft('class');
      });

      expect(result.current).toBeNull();
    });

    it('only removes the specified draft type', () => {
      act(() => {
        createDraft('class', 1, mockClassData);
        createDraft('combat-constants', 2, mockCombatConstants);
      });

      act(() => {
        discardDraft('class');
      });

      const { result: classResult } = renderHook(() => useDraft('class'));
      const { result: combatResult } = renderHook(() => useDraft('combat-constants'));

      expect(classResult.current).toBeNull();
      expect(combatResult.current).not.toBeNull();
    });
  });

  describe('hooks', () => {
    it('useCreateDraft returns stable callback', () => {
      const { result } = renderHook(() => useCreateDraft());

      expect(typeof result.current).toBe('function');
    });

    it('useDiscardDraft returns stable callback', () => {
      const { result } = renderHook(() => useDiscardDraft());

      expect(typeof result.current).toBe('function');
    });
  });
});
