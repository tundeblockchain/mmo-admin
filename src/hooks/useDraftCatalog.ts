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
import {
  CATALOG_TYPES,
  clearAllPersistedDrafts,
  clearPersistedDraft,
  readAllPersistedDrafts,
  readPersistedDraft,
  writePersistedDraft,
  type DraftWorkingCopy,
} from '../lib/draftPersistence';

export interface DraftState {
  catalogType: CatalogType;
  sourceVersion: number;
  isDirty: boolean;
  data: CatalogEntityData;
  wasRestored: boolean;
}

type DraftStore = Record<CatalogType, DraftState | null>;

function emptyDraftStore(): DraftStore {
  return {
    class: null,
    skill: null,
    'combat-constants': null,
    status: null,
    element: null,
    resonance: null,
  };
}

let draftStore: DraftStore = emptyDraftStore();

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function toWorkingCopy(state: DraftState): DraftWorkingCopy<CatalogEntityData> {
  return {
    catalogType: state.catalogType,
    sourceVersion: state.sourceVersion,
    isDirty: state.isDirty,
    data: state.data,
  };
}

function catalogWorkingCopy(workingCopy: DraftWorkingCopy): DraftWorkingCopy<CatalogEntityData> {
  return {
    catalogType: workingCopy.catalogType,
    sourceVersion: workingCopy.sourceVersion,
    isDirty: workingCopy.isDirty,
    data: workingCopy.data as CatalogEntityData,
  };
}

function persistDraftState(state: DraftState): void {
  writePersistedDraft(toWorkingCopy(state));
}

function draftFromWorkingCopy(
  workingCopy: DraftWorkingCopy<CatalogEntityData>,
  wasRestored: boolean,
): DraftState {
  return {
    catalogType: workingCopy.catalogType,
    sourceVersion: workingCopy.sourceVersion,
    isDirty: workingCopy.isDirty,
    data: workingCopy.data,
    wasRestored,
  };
}

export function hydrateDraftsFromStorage(): void {
  const persisted = readAllPersistedDrafts();
  let changed = false;
  const nextStore = { ...draftStore };

  for (const catalogType of CATALOG_TYPES) {
    if (nextStore[catalogType]) {
      continue;
    }

    const record = persisted[catalogType];
    if (!record) {
      continue;
    }

    nextStore[catalogType] = draftFromWorkingCopy(
      catalogWorkingCopy(record.draft),
      true,
    );
    changed = true;
  }

  if (changed) {
    draftStore = nextStore;
    notifyListeners();
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  hydrateDraftsFromStorage();
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
  const nextState: DraftState = {
    catalogType,
    sourceVersion,
    data: clonedData,
    isDirty: false,
    wasRestored: false,
  };

  draftStore = {
    ...draftStore,
    [catalogType]: nextState,
  };
  persistDraftState(nextState);
  notifyListeners();
}

export function updateDraft(catalogType: CatalogType, data: CatalogEntityData): void {
  const current = draftStore[catalogType];
  if (!current) return;

  const nextState: DraftState = {
    ...current,
    data,
    isDirty: true,
  };

  draftStore = {
    ...draftStore,
    [catalogType]: nextState,
  };
  persistDraftState(nextState);
  notifyListeners();
}

export function restorePersistedDraft(
  catalogType: CatalogType,
  sourceVersion: number,
): boolean {
  if (draftStore[catalogType]) {
    return false;
  }

  const record = readPersistedDraft(catalogType, sourceVersion);
  if (!record) {
    return false;
  }

  draftStore = {
    ...draftStore,
    [catalogType]: draftFromWorkingCopy(catalogWorkingCopy(record.draft), true),
  };
  notifyListeners();
  return true;
}

export function discardDraft(catalogType: CatalogType): void {
  const current = draftStore[catalogType];
  if (current) {
    clearPersistedDraft(catalogType, current.sourceVersion);
  }

  draftStore = {
    ...draftStore,
    [catalogType]: null,
  };
  notifyListeners();
}

export function discardAllDrafts(): void {
  clearAllPersistedDrafts();
  draftStore = emptyDraftStore();
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

export function resetDraftMemoryForTesting(): void {
  draftStore = emptyDraftStore();
  notifyListeners();
}

export function clearDraftStoreForTesting(): void {
  clearAllPersistedDrafts();
  resetDraftMemoryForTesting();
}
