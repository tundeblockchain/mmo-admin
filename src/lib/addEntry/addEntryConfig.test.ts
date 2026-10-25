import { describe, expect, it } from 'vitest';
import { CATALOG_SECTIONS } from '../catalogRoutes';
import { getAddEntryConfig, supportsAddEntry } from './addEntryConfig';
import { buildAddEntry, initialAddEntryValues } from './buildAddEntry';
import { validateAddEntryValues } from './validateAddEntry';
import type { CatalogType } from '../../types/catalog';

const catalogTypes: CatalogType[] = CATALOG_SECTIONS.map((section) => section.type);

describe('add entry field config', () => {
  it.each(catalogTypes)('defines fields for %s', (catalogType) => {
    const config = getAddEntryConfig(catalogType);
    expect(config.catalogType).toBe(catalogType);
    expect(config.fields.length).toBeGreaterThan(0);
    expect(config.title).toMatch(/^Add /);
  });

  it('requires a unique id field for list types', () => {
    for (const catalogType of catalogTypes) {
      if (catalogType === 'combat-constants') {
        expect(getAddEntryConfig(catalogType).fields.some((field) => field.idField)).toBe(false);
        continue;
      }
      expect(getAddEntryConfig(catalogType).fields.some((field) => field.idField)).toBe(true);
    }
  });

  it('builds defaults that pass field-editor validation once an id is set', () => {
    const values = initialAddEntryValues('class');
    values.classId = 'warden';

    expect(validateAddEntryValues('class', values, [])).toEqual({});
    expect(buildAddEntry('class', values)).toMatchObject({
      classId: 'warden',
      displayName: 'New Class',
      startingStats: { strength: 10, movementSpeed: 5 },
    });
  });

  it('allows combat-constants add only before a version exists', () => {
    expect(supportsAddEntry('combat-constants', false)).toBe(true);
    expect(supportsAddEntry('combat-constants', true)).toBe(false);
    expect(supportsAddEntry('class', true)).toBe(true);
  });
});
