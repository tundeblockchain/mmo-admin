import type { CatalogEntityData, CatalogType } from '../../types/catalog';

export function selectByIndexOrId<T>(
  items: T[] | undefined,
  selectedIndex: number | null,
  selectedId: string | null,
  getId: (item: T) => string,
): T | null {
  if (!items) {
    return null;
  }
  if (selectedIndex !== null) {
    return items[selectedIndex] ?? null;
  }
  return items.find((item) => getId(item) === selectedId) ?? null;
}

export interface VersionSelections {
  class: number | null;
  skill: number | null;
  'combat-constants': number | null;
  status: number | null;
  element: number | null;
  resonance: number | null;
}

export interface PendingDelete {
  index: number;
  entityId: string;
  displayName: string;
  kindLabel: string;
}

export function catalogDataByType(
  type: CatalogType,
  data: Record<CatalogType, CatalogEntityData | undefined>,
): CatalogEntityData | undefined {
  return data[type];
}

export function emptyVersionSelections(): VersionSelections {
  return {
    class: null,
    skill: null,
    'combat-constants': null,
    status: null,
    element: null,
    resonance: null,
  };
}
