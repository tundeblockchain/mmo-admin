import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { createDefaultClass, createDefaultCombatConstants } from '../lib/catalogDefaults';
import { mockClassCatalog } from '../test/mocks/catalog-fixtures';
import { useCatalogDraftActions } from './useCatalogDraftActions';
import {
  clearDraftStoreForTesting,
  createDraft,
  useDraft,
} from './useDraftCatalog';
import type { ClassDefinition } from '../types/catalog';

describe('useCatalogDraftActions', () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
  });

  it('replaces the selected class and adds or deletes entries', () => {
    createDraft('class', 2, mockClassCatalog.data);
    const selected = { current: 0 };
    const { result } = renderHook(() => {
      const draft = useDraft('class');
      const actions = useCatalogDraftActions({
        draft,
        selectedType: 'class',
        selectedIndex: selected.current,
        latestVersion: 2,
        setSelectedEntityId: () => undefined,
        setSelectedIndex: (index) => {
          selected.current = index ?? 0;
        },
      });
      return { draft, actions };
    });

    act(() => {
      result.current.actions.handleUpdateClassEntity({
        ...(result.current.draft?.data as ClassDefinition[])[0],
        displayName: 'Updated Vanguard',
      });
    });
    expect((result.current.draft?.data as ClassDefinition[])[0].displayName).toBe(
      'Updated Vanguard',
    );

    act(() => {
      result.current.actions.handleAddEntity({
        ...createDefaultClass(),
        classId: 'warden',
      });
    });
    expect((result.current.draft?.data as ClassDefinition[]).at(-1)?.displayName).toBe(
      'New Class',
    );

    act(() => {
      result.current.actions.handleConfirmDelete(0);
    });
    expect(
      (result.current.draft?.data as ClassDefinition[]).some(
        (item) => item.classId === 'vanguard',
      ),
    ).toBe(false);
  });

  it('does not add or delete combat-constants drafts', () => {
    createDraft('combat-constants', 1, {
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
    });
    const { result } = renderHook(() => {
      const draft = useDraft('combat-constants');
      return useCatalogDraftActions({
        draft,
        selectedType: 'combat-constants',
        selectedIndex: null,
        latestVersion: 1,
        setSelectedEntityId: () => undefined,
        setSelectedIndex: () => undefined,
      });
    });

    act(() => {
      result.current.handleAddEntity(createDefaultCombatConstants());
      result.current.handleConfirmDelete(0);
    });

    const { result: draftResult } = renderHook(() => useDraft('combat-constants'));
    expect(draftResult.current?.data).toMatchObject({
      critical: { baseCritChance: 0.05 },
    });
  });
});
