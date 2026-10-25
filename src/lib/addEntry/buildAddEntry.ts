import type { CatalogType } from '../../types/catalog';
import {
  createDefaultClass,
  createDefaultCombatConstants,
  createDefaultElement,
  createDefaultResonance,
  createDefaultSkill,
  createDefaultStatus,
} from '../catalogDefaults';
import { getAddEntryConfig } from './addEntryConfig';
import { getValueAtPath, setValueAtPath } from './paths';
import type { AddEntryEntity, AddEntryValues } from './types';

export function createDefaultEntry(catalogType: CatalogType): AddEntryEntity {
  switch (catalogType) {
    case 'class':
      return createDefaultClass();
    case 'skill':
      return createDefaultSkill();
    case 'status':
      return createDefaultStatus();
    case 'element':
      return createDefaultElement();
    case 'resonance':
      return createDefaultResonance();
    case 'combat-constants':
      return createDefaultCombatConstants();
  }
}

export function initialAddEntryValues(catalogType: CatalogType): AddEntryValues {
  const defaults = createDefaultEntry(catalogType);
  const values: AddEntryValues = {};

  for (const field of getAddEntryConfig(catalogType).fields) {
    values[field.key] = getValueAtPath(defaults, field.key);
  }

  return values;
}

export function buildAddEntry(catalogType: CatalogType, values: AddEntryValues): unknown {
  const next = JSON.parse(JSON.stringify(createDefaultEntry(catalogType))) as Record<string, unknown>;

  for (const [key, value] of Object.entries(values)) {
    setValueAtPath(next, key, value);
  }

  return next;
}
