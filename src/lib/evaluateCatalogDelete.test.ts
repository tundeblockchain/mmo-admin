import { describe, expect, it } from 'vitest';
import { mockClassCatalog, mockSkillCatalog } from '../test/mocks/catalog-fixtures';
import {
  evaluateCatalogDelete,
  lastEntryDeleteMessage,
} from './evaluateCatalogDelete';
import type { CatalogReadiness } from './catalogDependents';

const ready: CatalogReadiness = {
  class: true,
  skill: true,
  status: true,
  element: true,
  resonance: true,
};

const snapshot = {
  class: mockClassCatalog.data,
  skill: mockSkillCatalog.data,
};

describe('evaluateCatalogDelete', () => {
  it('blocks deleting the last remaining entry', () => {
    expect(
      evaluateCatalogDelete({
        catalogType: 'skill',
        draftLength: 1,
        entityId: 'vanguard_cleaving_strike',
        snapshot,
        ready,
      }),
    ).toEqual({
      status: 'last-entry',
      message: lastEntryDeleteMessage('skill'),
    });
  });

  it('blocks a class that skills still reference', () => {
    expect(
      evaluateCatalogDelete({
        catalogType: 'class',
        draftLength: 2,
        entityId: 'vanguard',
        snapshot,
        ready,
      }),
    ).toEqual({
      status: 'blocked',
      dependents: [
        {
          catalogType: 'skill',
          id: 'vanguard_cleaving_strike',
          displayName: 'Cleaving Strike',
        },
      ],
    });
  });

  it('allows a class with no dependents once catalogs are ready', () => {
    expect(
      evaluateCatalogDelete({
        catalogType: 'class',
        draftLength: 2,
        entityId: 'ranger',
        snapshot,
        ready,
      }),
    ).toEqual({ status: 'confirm' });
  });

  it('waits when required published catalogs have not loaded', () => {
    expect(
      evaluateCatalogDelete({
        catalogType: 'class',
        draftLength: 2,
        entityId: 'ranger',
        snapshot,
        ready: { ...ready, skill: false },
      }),
    ).toEqual({ status: 'loading' });
  });

  it('uses a draft skill list instead of published dependents', () => {
    expect(
      evaluateCatalogDelete({
        catalogType: 'class',
        draftLength: 2,
        entityId: 'vanguard',
        snapshot: { class: mockClassCatalog.data, skill: [] },
        ready,
      }),
    ).toEqual({ status: 'confirm' });
  });
});
