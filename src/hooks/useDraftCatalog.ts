import { useCallback, useSyncExternalStore } from 'react';
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
import {
  createDraft,
  discardDraft,
  getDraftStoreSnapshot,
  subscribeToDraftStore,
  updateDraft,
  type DraftState,
  type DraftStore,
} from './draftStore';

export type { DraftState } from './draftStore';
export {
  createDraft,
  updateDraft,
  restorePersistedDraft,
  discardDraft,
  discardAllDrafts,
  hydrateDraftsFromStorage,
  resetDraftMemoryForTesting,
  clearDraftStoreForTesting,
} from './draftStore';

export function useDraftStore(): DraftStore {
  return useSyncExternalStore(subscribeToDraftStore, getDraftStoreSnapshot, getDraftStoreSnapshot);
}

export function useDraft(catalogType: CatalogType): DraftState | null {
  const store = useDraftStore();
  return store[catalogType];
}

export function useCreateDraft() {
  return useCallback(
    (catalogType: CatalogType, sourceVersion: number, data: CatalogEntityData) => {
      createDraft(catalogType, sourceVersion, data);
    },
    [],
  );
}

export function useUpdateClassDraft() {
  return useCallback((data: ClassDefinition[]) => {
    updateDraft('class', data);
  }, []);
}

export function useUpdateSkillDraft() {
  return useCallback((data: SkillDefinition[]) => {
    updateDraft('skill', data);
  }, []);
}

export function useUpdateStatusDraft() {
  return useCallback((data: StatusDefinition[]) => {
    updateDraft('status', data);
  }, []);
}

export function useUpdateElementDraft() {
  return useCallback((data: ElementDefinition[]) => {
    updateDraft('element', data);
  }, []);
}

export function useUpdateResonanceDraft() {
  return useCallback((data: ResonanceDefinition[]) => {
    updateDraft('resonance', data);
  }, []);
}

export function useUpdateCombatConstantsDraft() {
  return useCallback((data: CombatConstantsData) => {
    updateDraft('combat-constants', data);
  }, []);
}

export function useDiscardDraft() {
  return useCallback((catalogType: CatalogType) => {
    discardDraft(catalogType);
  }, []);
}
