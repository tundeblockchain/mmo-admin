import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useDraft,
  createDraft,
  updateDraft,
  discardDraft,
  clearDraftStoreForTesting,
  resetDraftMemoryForTesting,
  restorePersistedDraft,
} from './useDraftCatalog';
import { draftStorageKey, parsePersistedDraftRecord } from '../lib/draftPersistence';
import type { ClassDefinition } from '../types/catalog';
import { mockClassCatalog, mockCombatConstantsCatalog } from '../test/mocks/catalog-fixtures';

const mockClassData = mockClassCatalog.data;
const mockCombatConstants = mockCombatConstantsCatalog.data;

describe('useDraftCatalog', () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
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
});
