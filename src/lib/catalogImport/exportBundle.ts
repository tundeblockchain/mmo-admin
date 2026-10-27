import type { CatalogEntityData, CatalogType } from '../../types/catalog';
import { CATALOG_TYPES } from '../draftKeys';
import type { DraftStore } from '../../hooks/draftStore';
import { isRecord } from './parseHelpers';
import type { CatalogBundle } from './types';

export type ExportSource = 'draft' | 'published';

export function buildCatalogBundle(args: {
  versionTag?: string;
  source: ExportSource;
  drafts: DraftStore;
  published: Partial<Record<CatalogType, CatalogEntityData | undefined>>;
}): CatalogBundle {
  const bundle: CatalogBundle = {};
  if (args.versionTag) {
    bundle.versionTag = args.versionTag;
  }

  for (const catalogType of CATALOG_TYPES) {
    const data =
      args.source === 'draft'
        ? (args.drafts[catalogType]?.data ?? args.published[catalogType])
        : args.published[catalogType];
    if (!hasExportableData(catalogType, data)) {
      continue;
    }
    assignBundleData(bundle, catalogType, data);
  }

  return bundle;
}

export function catalogBundleFilename(source: ExportSource, versionTag?: string): string {
  const tag = versionTag && versionTag.trim() !== '' ? versionTag : 'catalog';
  return `${tag}-${source}.json`;
}

function hasExportableData(
  catalogType: CatalogType,
  data: CatalogEntityData | undefined,
): data is CatalogEntityData {
  if (data === undefined) {
    return false;
  }
  if (catalogType === 'combat-constants') {
    return isRecord(data) && 'powerScaling' in data;
  }
  return Array.isArray(data);
}

function assignBundleData(
  bundle: CatalogBundle,
  catalogType: CatalogType,
  data: CatalogEntityData,
): void {
  switch (catalogType) {
    case 'class':
      bundle.class = data as CatalogBundle['class'];
      break;
    case 'skill':
      bundle.skill = data as CatalogBundle['skill'];
      break;
    case 'status':
      bundle.status = data as CatalogBundle['status'];
      break;
    case 'element':
      bundle.element = data as CatalogBundle['element'];
      break;
    case 'resonance':
      bundle.resonance = data as CatalogBundle['resonance'];
      break;
    case 'combat-constants':
      bundle['combat-constants'] = data as CatalogBundle['combat-constants'];
      break;
  }
}
