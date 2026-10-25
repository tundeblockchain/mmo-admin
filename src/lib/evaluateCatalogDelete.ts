import type { CatalogType } from '../types/catalog';
import {
  findCatalogDependents,
  isSnapshotReadyFor,
  type CatalogDependent,
  type CatalogEntriesSnapshot,
  type CatalogReadiness,
} from './catalogDependents';
import { entityKindLabel } from './catalogLabels';

export type CatalogDeleteEvaluation =
  | { status: 'loading' }
  | { status: 'last-entry'; message: string }
  | { status: 'blocked'; dependents: CatalogDependent[] }
  | { status: 'confirm' };

export function lastEntryDeleteMessage(kindLabel: string): string {
  return `The last ${kindLabel} cannot be deleted. A published catalog version must contain at least one entry.`;
}

export function evaluateCatalogDelete(options: {
  catalogType: CatalogType;
  draftLength: number;
  entityId: string;
  snapshot: CatalogEntriesSnapshot;
  ready: CatalogReadiness;
}): CatalogDeleteEvaluation {
  if (options.catalogType === 'combat-constants') {
    return {
      status: 'last-entry',
      message: 'Combat Constants is a single object and cannot be deleted.',
    };
  }

  if (options.draftLength <= 1) {
    return {
      status: 'last-entry',
      message: lastEntryDeleteMessage(entityKindLabel(options.catalogType)),
    };
  }

  if (!isSnapshotReadyFor(options.catalogType, options.ready)) {
    return { status: 'loading' };
  }

  const dependents = findCatalogDependents(
    options.catalogType,
    options.entityId,
    options.snapshot,
  );
  if (dependents.length > 0) {
    return { status: 'blocked', dependents };
  }

  return { status: 'confirm' };
}
