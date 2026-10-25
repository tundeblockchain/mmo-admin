import type { CatalogType } from '../../types/catalog';
import { COMBAT_CONSTANTS_ADD_ENTRY_CONFIG } from './combatFieldConfig';
import {
  CLASS_ADD_ENTRY_CONFIG,
  ELEMENT_ADD_ENTRY_CONFIG,
  RESONANCE_ADD_ENTRY_CONFIG,
  SKILL_ADD_ENTRY_CONFIG,
  STATUS_ADD_ENTRY_CONFIG,
} from './listFieldConfigs';
import type { AddEntryConfig, AddEntryField } from './types';

const ADD_ENTRY_CONFIGS: Record<CatalogType, AddEntryConfig> = {
  class: CLASS_ADD_ENTRY_CONFIG,
  skill: SKILL_ADD_ENTRY_CONFIG,
  status: STATUS_ADD_ENTRY_CONFIG,
  element: ELEMENT_ADD_ENTRY_CONFIG,
  resonance: RESONANCE_ADD_ENTRY_CONFIG,
  'combat-constants': COMBAT_CONSTANTS_ADD_ENTRY_CONFIG,
};

export function getAddEntryConfig(catalogType: CatalogType): AddEntryConfig {
  return ADD_ENTRY_CONFIGS[catalogType];
}

export function getAddEntryIdField(catalogType: CatalogType): AddEntryField | null {
  return ADD_ENTRY_CONFIGS[catalogType].fields.find((field) => field.idField) ?? null;
}

export function supportsAddEntry(catalogType: CatalogType, hasPublishedVersion: boolean): boolean {
  if (catalogType === 'combat-constants') {
    return !hasPublishedVersion;
  }
  return true;
}
