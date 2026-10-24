import { describe, it, expect, beforeEach } from 'vitest';
import {
  DRAFT_SCHEMA_VERSION,
  clearAllPersistedDrafts,
  clearPersistedDraft,
  draftStorageKey,
  parsePersistedDraftRecord,
  readLatestPersistedDraft,
  readPersistedDraft,
  writePersistedDraft,
} from './draftPersistence';
import type { ClassDefinition, SkillDefinition } from '../types/catalog';

const classData: ClassDefinition[] = [
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
      movementSpeed: 5,
    },
    resonance: 'valor',
    roles: ['tank', 'dps'],
  },
];

const skillData: SkillDefinition[] = [
  {
    skillId: 'vanguard_cleaving_strike',
    classId: 'vanguard',
    displayName: 'Cleaving Strike',
    description: '1.50 P + 0.60 STR, 120° arc.',
    kind: 'active',
    resourceId: null,
    resourceCost: 0,
    cooldownSeconds: 0,
    charges: 1,
    chargeRechargeSeconds: 0,
    castTimeSeconds: 0,
    castableWhileMoving: false,
    range: 0,
    coefficients: { basePower: 1.5, scaling: [] },
    unlockLevel: 1,
    iconPath: 'icons/skills/vanguard/cleaving_strike.png',
  },
];

describe('draftPersistence', () => {
  beforeEach(() => {
    clearAllPersistedDrafts();
  });

  it('writes a schema version, timestamp, and the whole working copy', () => {
    writePersistedDraft({
      catalogType: 'class',
      sourceVersion: 2,
      isDirty: true,
      data: classData,
    });

    const raw = localStorage.getItem(draftStorageKey('class', 2));
    expect(raw).toBeTruthy();

    const record = parsePersistedDraftRecord(raw ?? '');
    expect(record).toEqual({
      schemaVersion: DRAFT_SCHEMA_VERSION,
      savedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      draft: {
        catalogType: 'class',
        sourceVersion: 2,
        isDirty: true,
        data: classData,
      },
    });
    expect(raw).not.toMatch(/token|authorization|password|Bearer/i);
  });

  it('keys drafts separately by catalog type and base version', () => {
    writePersistedDraft({
      catalogType: 'class',
      sourceVersion: 1,
      isDirty: true,
      data: classData,
    });
    writePersistedDraft({
      catalogType: 'class',
      sourceVersion: 2,
      isDirty: false,
      data: classData,
    });
    writePersistedDraft({
      catalogType: 'skill',
      sourceVersion: 1,
      isDirty: true,
      data: skillData,
    });

    expect(readPersistedDraft('class', 1)?.draft.sourceVersion).toBe(1);
    expect(readPersistedDraft('class', 2)?.draft.sourceVersion).toBe(2);
    expect(readPersistedDraft('skill', 1)?.draft.data).toEqual(skillData);
    expect(readPersistedDraft('class', 1)?.draft.data).toEqual(classData);
  });

  it('clears a stored draft for one type and version', () => {
    writePersistedDraft({
      catalogType: 'class',
      sourceVersion: 1,
      isDirty: true,
      data: classData,
    });
    writePersistedDraft({
      catalogType: 'skill',
      sourceVersion: 1,
      isDirty: true,
      data: skillData,
    });

    clearPersistedDraft('class', 1);

    expect(readPersistedDraft('class', 1)).toBeNull();
    expect(readPersistedDraft('skill', 1)).not.toBeNull();
  });

  it('clears corrupt or unparseable entries without throwing', () => {
    const key = draftStorageKey('class', 1);
    localStorage.setItem(key, '{not-json');

    expect(() => readPersistedDraft('class', 1)).not.toThrow();
    expect(readPersistedDraft('class', 1)).toBeNull();
    expect(localStorage.getItem(key)).toBeNull();
  });

  it('clears entries with an unsupported schema or mismatched identity', () => {
    localStorage.setItem(
      draftStorageKey('class', 1),
      JSON.stringify({
        schemaVersion: 99,
        savedAt: '2024-06-01T00:00:00.000Z',
        draft: {
          catalogType: 'class',
          sourceVersion: 1,
          isDirty: true,
          data: classData,
        },
      }),
    );

    expect(readPersistedDraft('class', 1)).toBeNull();
    expect(localStorage.getItem(draftStorageKey('class', 1))).toBeNull();

    localStorage.setItem(
      draftStorageKey('class', 1),
      JSON.stringify({
        schemaVersion: DRAFT_SCHEMA_VERSION,
        savedAt: '2024-06-01T00:00:00.000Z',
        draft: {
          catalogType: 'skill',
          sourceVersion: 2,
          isDirty: true,
          data: skillData,
        },
      }),
    );

    expect(readPersistedDraft('class', 1)).toBeNull();
    expect(localStorage.getItem(draftStorageKey('class', 1))).toBeNull();
  });

  it('returns the most recently saved draft for a catalog type', () => {
    localStorage.setItem(
      draftStorageKey('class', 1),
      JSON.stringify({
        schemaVersion: DRAFT_SCHEMA_VERSION,
        savedAt: '2024-06-01T00:00:00.000Z',
        draft: {
          catalogType: 'class',
          sourceVersion: 1,
          isDirty: true,
          data: classData,
        },
      }),
    );
    localStorage.setItem(
      draftStorageKey('class', 2),
      JSON.stringify({
        schemaVersion: DRAFT_SCHEMA_VERSION,
        savedAt: '2024-06-15T00:00:00.000Z',
        draft: {
          catalogType: 'class',
          sourceVersion: 2,
          isDirty: true,
          data: [{ ...classData[0], displayName: 'Newer Vanguard' }],
        },
      }),
    );

    const latest = readLatestPersistedDraft('class');
    expect(latest?.draft.sourceVersion).toBe(2);
    expect((latest?.draft.data as ClassDefinition[])[0].displayName).toBe('Newer Vanguard');
  });
});
