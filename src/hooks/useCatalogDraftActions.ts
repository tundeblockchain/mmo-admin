import { useCallback } from 'react';
import {
  createDefaultClass,
  createDefaultElement,
  createDefaultResonance,
  createDefaultSkill,
  createDefaultStatus,
} from '../lib/catalogDefaults';
import { getEntityId } from '../lib/catalogIds';
import { updateDraft, type DraftState } from './useDraftCatalog';
import type {
  CatalogEntityData,
  CatalogType,
  ClassDefinition,
  CombatConstantsData,
  ElementDefinition,
  ResonanceDefinition,
  SkillDefinition,
  StatusDefinition,
} from '../types/catalog';

interface UseCatalogDraftActionsOptions {
  draft: DraftState | null;
  selectedType: CatalogType;
  selectedIndex: number | null;
  setSelectedEntityId: (id: string | null) => void;
  setSelectedIndex: (index: number | null) => void;
}

function replaceAt<T>(items: T[], index: number, updated: T): T[] {
  return items.map((item, itemIndex) => (itemIndex === index ? updated : item));
}

function removeAt<T>(items: T[], index: number): T[] {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

export function useCatalogDraftActions({
  draft,
  selectedType,
  selectedIndex,
  setSelectedEntityId,
  setSelectedIndex,
}: UseCatalogDraftActionsOptions) {
  const handleUpdateEntity = useCallback(
    (updated: unknown) => {
      if (!draft || selectedType === 'combat-constants' || selectedIndex === null) {
        return;
      }

      const items = draft.data as unknown[];
      updateDraft(selectedType, replaceAt(items, selectedIndex, updated) as CatalogEntityData);
      setSelectedEntityId(getEntityId(updated, selectedType));
    },
    [draft, selectedIndex, selectedType, setSelectedEntityId],
  );

  const handleUpdateCombatConstants = useCallback(
    (updated: CombatConstantsData) => {
      if (!draft || selectedType !== 'combat-constants') return;
      updateDraft('combat-constants', updated);
    },
    [draft, selectedType],
  );

  const handleAddEntity = useCallback(() => {
    if (!draft || selectedType === 'combat-constants') return;

    const factories = {
      class: createDefaultClass,
      skill: createDefaultSkill,
      status: createDefaultStatus,
      element: createDefaultElement,
      resonance: createDefaultResonance,
    } as const;

    const next = [...(draft.data as unknown[]), factories[selectedType]()];
    updateDraft(selectedType, next as CatalogEntityData);
    setSelectedIndex(next.length - 1);
    setSelectedEntityId(getEntityId(next[next.length - 1], selectedType));
  }, [draft, selectedType, setSelectedEntityId, setSelectedIndex]);

  const handleConfirmDelete = useCallback(
    (index: number) => {
      if (!draft || selectedType === 'combat-constants') return;
      updateDraft(selectedType, removeAt(draft.data as unknown[], index) as CatalogEntityData);
      setSelectedEntityId(null);
      setSelectedIndex(null);
    },
    [draft, selectedType, setSelectedEntityId, setSelectedIndex],
  );

  return {
    handleUpdateClassEntity: handleUpdateEntity as (updated: ClassDefinition) => void,
    handleUpdateSkillEntity: handleUpdateEntity as (updated: SkillDefinition) => void,
    handleUpdateStatusEntity: handleUpdateEntity as (updated: StatusDefinition) => void,
    handleUpdateElementEntity: handleUpdateEntity as (updated: ElementDefinition) => void,
    handleUpdateResonanceEntity: handleUpdateEntity as (updated: ResonanceDefinition) => void,
    handleUpdateCombatConstants,
    handleAddEntity,
    handleConfirmDelete,
  };
}
