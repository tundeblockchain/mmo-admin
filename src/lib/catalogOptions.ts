import { catalogLabelForType, catalogPathForType } from './catalogRoutes';
import { entityKindLabel } from './catalogLabels';
import { getEntityId } from './catalogIds';
import type { CatalogEntityData, CatalogType } from '../types/catalog';

export type CatalogReferenceType = Exclude<CatalogType, 'combat-constants'>;

export interface CatalogOption {
  id: string;
  label: string;
}

export function isCatalogReferenceType(
  catalogType: CatalogType,
): catalogType is CatalogReferenceType {
  return catalogType !== 'combat-constants';
}

export function catalogEntities(data: CatalogEntityData | undefined): unknown[] {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  return data;
}

function entityLabel(entity: unknown, catalogType: CatalogReferenceType): string {
  if (typeof entity === 'object' && entity !== null && 'displayName' in entity) {
    const displayName = entity.displayName;
    if (typeof displayName === 'string' && displayName.trim() !== '') {
      return displayName;
    }
  }
  return getEntityId(entity, catalogType);
}

export function mergeCatalogOptions(
  catalogType: CatalogReferenceType,
  publishedEntities: readonly unknown[],
  draftEntities: readonly unknown[],
): CatalogOption[] {
  const seen = new Set<string>();
  const options: CatalogOption[] = [];

  for (const entity of [...draftEntities, ...publishedEntities]) {
    const id = getEntityId(entity, catalogType).trim();
    if (id === '' || seen.has(id)) {
      continue;
    }
    seen.add(id);
    options.push({ id, label: entityLabel(entity, catalogType) });
  }

  return options;
}

export function optionsWithCurrentValue(
  options: readonly CatalogOption[],
  value: string,
): CatalogOption[] {
  if (value === '' || options.some((option) => option.id === value)) {
    return [...options];
  }
  return [...options, { id: value, label: value }];
}

export function catalogReferenceArticle(kind: string): 'a' | 'an' {
  return /^[aeiou]/i.test(kind) ? 'an' : 'a';
}

export function catalogReferenceEmptyMessage(catalogType: CatalogReferenceType): string {
  const kind = entityKindLabel(catalogType);
  return `Add ${catalogReferenceArticle(kind)} ${kind} first.`;
}

export function catalogReferenceHref(catalogType: CatalogReferenceType): string {
  return catalogPathForType(catalogType);
}

export function catalogReferenceLinkLabel(catalogType: CatalogReferenceType): string {
  return catalogLabelForType(catalogType);
}
