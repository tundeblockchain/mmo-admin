import type { CatalogType, CatalogEntityData } from '../types/catalog';

export function getEntityId(entity: unknown, catalogType: CatalogType): string {
  const record = entity as Record<string, unknown>;
  switch (catalogType) {
    case 'class':
      return String(record.classId ?? '');
    case 'skill':
      return String(record.skillId ?? '');
    case 'status':
      return String(record.statusId ?? '');
    case 'element':
      return String(record.elementId ?? '');
    case 'resonance':
      return String(record.resonanceId ?? '');
    case 'combat-constants':
      return 'combat-constants';
  }
}

export function getIdFieldLabel(catalogType: CatalogType): string {
  switch (catalogType) {
    case 'class':
      return 'Class ID';
    case 'skill':
      return 'Skill ID';
    case 'status':
      return 'Status ID';
    case 'element':
      return 'Element ID';
    case 'resonance':
      return 'Resonance ID';
    case 'combat-constants':
      return 'Combat Constants';
  }
}

export function getIdValidationMessage(id: string, siblingIds: string[]): string | null {
  if (id.trim() === '') {
    return 'ID is required';
  }

  const duplicates = siblingIds.filter((other) => other.trim() === id.trim());
  if (duplicates.length > 1) {
    return 'ID must be unique within this draft';
  }

  return null;
}

export function collectEntityIds(data: CatalogEntityData, catalogType: CatalogType): string[] {
  if (catalogType === 'combat-constants' || !Array.isArray(data)) {
    return [];
  }

  return data.map((entity) => getEntityId(entity, catalogType));
}

export function draftHasInvalidIds(data: CatalogEntityData, catalogType: CatalogType): boolean {
  if (catalogType === 'combat-constants') {
    return false;
  }

  const ids = collectEntityIds(data, catalogType);
  return ids.some((id) => getIdValidationMessage(id, ids) !== null);
}
