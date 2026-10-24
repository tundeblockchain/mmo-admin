import type { CatalogType, CatalogEntityData } from '../types/catalog';
import { getEntityId } from './catalogIds';

export interface DiffSummary {
  added: number;
  modified: number;
  removed: number;
  unchanged: number;
}

export function computeDiffSummary(
  original: CatalogEntityData,
  draft: CatalogEntityData,
  catalogType: CatalogType,
): DiffSummary {
  if (catalogType === 'combat-constants') {
    const isModified = JSON.stringify(original) !== JSON.stringify(draft);
    return {
      added: 0,
      modified: isModified ? 1 : 0,
      removed: 0,
      unchanged: isModified ? 0 : 1,
    };
  }

  const originalArray = original as unknown[];
  const draftArray = draft as unknown[];

  const originalMap = new Map<string, string>();
  for (const item of originalArray) {
    const id = getEntityId(item, catalogType);
    originalMap.set(id, JSON.stringify(item));
  }

  const draftMap = new Map<string, string>();
  for (const item of draftArray) {
    const id = getEntityId(item, catalogType);
    draftMap.set(id, JSON.stringify(item));
  }

  let added = 0;
  let modified = 0;
  let removed = 0;
  let unchanged = 0;

  for (const [id, json] of draftMap) {
    const originalJson = originalMap.get(id);
    if (!originalJson) {
      added++;
    } else if (originalJson !== json) {
      modified++;
    } else {
      unchanged++;
    }
  }

  for (const id of originalMap.keys()) {
    if (!draftMap.has(id)) {
      removed++;
    }
  }

  return { added, modified, removed, unchanged };
}
