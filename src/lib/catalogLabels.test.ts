import { describe, expect, it } from 'vitest';
import { entityKindLabel, formatCatalogType } from './catalogLabels';

describe('formatCatalogType', () => {
  it('title-cases standard catalog types', () => {
    expect(formatCatalogType('class')).toBe('Class');
    expect(formatCatalogType('skill')).toBe('Skill');
  });

  it('formats combat-constants as Combat Constants', () => {
    expect(formatCatalogType('combat-constants')).toBe('Combat Constants');
  });
});

describe('entityKindLabel', () => {
  it('returns the singular kind used in delete copy', () => {
    expect(entityKindLabel('class')).toBe('class');
    expect(entityKindLabel('combat-constants')).toBe('combat constants');
  });
});
