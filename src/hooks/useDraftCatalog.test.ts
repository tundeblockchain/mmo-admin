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
  resetDraftMemoryForTesting,
  restorePersistedDraft,
} from './useDraftCatalog';
import { draftStorageKey, parsePersistedDraftRecord } from '../lib/draftPersistence';
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
      expect(result.current?.wasRestored).toBe(false);
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

  describe('persistence', () => {
    it('persists the working copy when a draft is created or edited', () => {
      act(() => {
        createDraft('class', 1, mockClassData);
      });

      const created = parsePersistedDraftRecord(
        localStorage.getItem(draftStorageKey('class', 1)) ?? '',
      );
      expect(created?.draft.isDirty).toBe(false);
      expect(created?.draft.data).toEqual(mockClassData);

      const modifiedData = mockClassData.map((item) => ({
        ...item,
        displayName: 'Modified Vanguard',
      }));

      act(() => {
        updateDraft('class', modifiedData);
      });

      const updated = parsePersistedDraftRecord(
        localStorage.getItem(draftStorageKey('class', 1)) ?? '',
      );
      expect(updated?.schemaVersion).toBe(1);
      expect(updated?.draft.isDirty).toBe(true);
      expect((updated?.draft.data as ClassDefinition[])[0].displayName).toBe(
        'Modified Vanguard',
      );
    });

    it('restores a persisted draft after the in-memory store is reset', () => {
      act(() => {
        createDraft('class', 1, mockClassData);
        updateDraft(
          'class',
          mockClassData.map((item) => ({ ...item, displayName: 'Restored Vanguard' })),
        );
        resetDraftMemoryForTesting();
      });

      const { result } = renderHook(() => useDraft('class'));

      expect(result.current?.wasRestored).toBe(true);
      expect(result.current?.isDirty).toBe(true);
      expect((result.current?.data as ClassDefinition[])[0].displayName).toBe(
        'Restored Vanguard',
      );
    });

    it('keeps drafts keyed separately per catalog type and base version', () => {
      act(() => {
        createDraft('class', 1, mockClassData);
        createDraft('combat-constants', 2, mockCombatConstants);
        createDraft('class', 2, mockClassData);
      });

      expect(localStorage.getItem(draftStorageKey('class', 1))).toBeTruthy();
      expect(localStorage.getItem(draftStorageKey('class', 2))).toBeTruthy();
      expect(localStorage.getItem(draftStorageKey('combat-constants', 2))).toBeTruthy();

      act(() => {
        resetDraftMemoryForTesting();
        restorePersistedDraft('class', 1);
      });

      const { result } = renderHook(() => useDraft('class'));
      expect(result.current?.sourceVersion).toBe(1);
      expect(result.current?.wasRestored).toBe(true);
    });

    it('clears stored drafts when discarded', () => {
      act(() => {
        createDraft('class', 1, mockClassData);
        createDraft('combat-constants', 2, mockCombatConstants);
        discardDraft('class');
      });

      expect(localStorage.getItem(draftStorageKey('class', 1))).toBeNull();
      expect(localStorage.getItem(draftStorageKey('combat-constants', 2))).toBeTruthy();
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
