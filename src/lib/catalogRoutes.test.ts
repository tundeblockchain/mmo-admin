import { describe, expect, it } from 'vitest';
import type { CatalogType } from '../types/catalog';
import {
  CATALOG_DEFAULT_PATH,
  CATALOG_SECTIONS,
  catalogPath,
  catalogPathForType,
  catalogTypeFromSection,
  isUnknownCatalogSection,
} from './catalogRoutes';

const expectedTypes: CatalogType[] = [
  'class',
  'skill',
  'combat-constants',
  'status',
  'element',
  'resonance',
];

describe('catalogRoutes', () => {
  it('maps every catalog type to a unique sidebar slug', () => {
    expect(CATALOG_SECTIONS.map((section) => section.type)).toEqual(expectedTypes);
    expect(new Set(CATALOG_SECTIONS.map((section) => section.slug)).size).toBe(
      CATALOG_SECTIONS.length,
    );
  });

  it('resolves section slugs used by the sidebar routes', () => {
    expect(catalogTypeFromSection('classes')).toBe('class');
    expect(catalogTypeFromSection('skills')).toBe('skill');
    expect(catalogTypeFromSection('combat-constants')).toBe('combat-constants');
    expect(catalogTypeFromSection('statuses')).toBe('status');
    expect(catalogTypeFromSection('elements')).toBe('element');
    expect(catalogTypeFromSection('resonance')).toBe('resonance');
    expect(catalogTypeFromSection(undefined)).toBeNull();
    expect(catalogTypeFromSection('unknown')).toBeNull();
  });

  it('builds catalog paths and treats unknown sections as invalid', () => {
    expect(catalogPath('skills')).toBe('/catalog/skills');
    expect(catalogPathForType('status')).toBe('/catalog/statuses');
    expect(catalogPathForType('class')).toBe(CATALOG_DEFAULT_PATH);
    expect(isUnknownCatalogSection(undefined)).toBe(false);
    expect(isUnknownCatalogSection('classes')).toBe(false);
    expect(isUnknownCatalogSection('not-a-section')).toBe(true);
  });
});
