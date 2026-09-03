import { useSyncExternalStore, useCallback } from 'react';
import type {
  CatalogType,
  CatalogEntityData,
  ClassDefinition,
  SkillDefinition,
  StatusDefinition,
  ElementDefinition,
  ResonanceDefinition,
  CombatConstantsData,
} from '../types/catalog';

export interface DraftState {
  catalogType: CatalogType;
  sourceVersion: number;
  data: CatalogEntityData;
  isDirty: boolean;
}

type DraftStore = Record<CatalogType, DraftState | null>;

let draftStore: DraftStore = {
  class: null,
  skill: null,
  'combat-constants': null,
  status: null,
  element: null,
  resonance: null,
};

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): DraftStore {
  return draftStore;
}

function getServerSnapshot(): DraftStore {
  return draftStore;
}

export function createDraft(
  catalogType: CatalogType,
  sourceVersion: number,
  data: CatalogEntityData,
): void {
  const clonedData = JSON.parse(JSON.stringify(data)) as CatalogEntityData;
  draftStore = {
    ...draftStore,
    [catalogType]: {
      catalogType,
      sourceVersion,
      data: clonedData,
      isDirty: false,
    },
  };
  notifyListeners();
}

export function updateDraft(catalogType: CatalogType, data: CatalogEntityData): void {
  const current = draftStore[catalogType];
  if (!current) return;

  draftStore = {
    ...draftStore,
    [catalogType]: {
      ...current,
      data,
      isDirty: true,
    },
  };
  notifyListeners();
}

export function discardDraft(catalogType: CatalogType): void {
  draftStore = {
    ...draftStore,
    [catalogType]: null,
  };
  notifyListeners();
}

export function discardAllDrafts(): void {
  draftStore = {
    class: null,
    skill: null,
    'combat-constants': null,
    status: null,
    element: null,
    resonance: null,
  };
  notifyListeners();
}

export function useDraftStore(): DraftStore {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
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

export function clearDraftStoreForTesting(): void {
  draftStore = {
    class: null,
    skill: null,
    'combat-constants': null,
    status: null,
    element: null,
    resonance: null,
  };
  notifyListeners();
}
