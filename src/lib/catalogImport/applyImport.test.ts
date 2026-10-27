import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearDraftStoreForTesting,
  createDraft,
  getDraftStoreSnapshot,
} from '../../hooks/draftStore';
import { createDefaultClass } from '../catalogDefaults';
import { applyCatalogImport } from './applyImport';
import { validateCatalogBundle } from './validateBundle';

const vanguard = { ...createDefaultClass(), classId: 'vanguard', displayName: 'Vanguard' };

describe('applyCatalogImport', () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
  });

  it('writes a valid bundle into drafts', () => {
    const result = validateCatalogBundle({ class: [vanguard] });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    applyCatalogImport(result.bundle, getDraftStoreSnapshot(), { class: 2 });
    const draft = getDraftStoreSnapshot().class;
    expect(draft?.isDirty).toBe(true);
    expect(draft?.sourceVersion).toBe(2);
    expect(draft?.data).toEqual([expect.objectContaining({ classId: 'vanguard' })]);
  });

  it('leaves the existing draft untouched when validation fails', () => {
    createDraft('class', 2, [vanguard]);
    const before = JSON.parse(JSON.stringify(getDraftStoreSnapshot()));

    const result = validateCatalogBundle({
      class: [{ ...vanguard, classId: '' }],
    });
    expect(result.ok).toBe(false);
    if (result.ok) {
      applyCatalogImport(result.bundle, getDraftStoreSnapshot(), { class: 2 });
    }

    expect(getDraftStoreSnapshot()).toEqual(before);
    expect(getDraftStoreSnapshot().class?.data).toEqual([
      expect.objectContaining({ classId: 'vanguard', displayName: 'Vanguard' }),
    ]);
  });
});
