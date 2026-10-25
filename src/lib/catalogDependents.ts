import type {
  CatalogType,
  ClassDefinition,
  ElementDefinition,
  ResonanceDefinition,
  SkillDefinition,
  StatusDefinition,
} from '../types/catalog';
import { getEntityId } from './catalogIds';

export const LIST_CATALOG_TYPES = ['class', 'skill', 'status', 'element', 'resonance'] as const;

export type ListCatalogType = (typeof LIST_CATALOG_TYPES)[number];

export interface CatalogDependent {
  catalogType: ListCatalogType;
  id: string;
  displayName: string;
}

export interface CatalogEntriesSnapshot {
  class?: ClassDefinition[];
  skill?: SkillDefinition[];
  status?: StatusDefinition[];
  element?: ElementDefinition[];
  resonance?: ResonanceDefinition[];
}

export interface CatalogReadiness {
  class: boolean;
  skill: boolean;
  status: boolean;
  element: boolean;
  resonance: boolean;
}

function dependentName(displayName: string, id: string): string {
  const trimmed = displayName.trim();
  return trimmed === '' ? id : trimmed;
}

function toDependent(
  catalogType: ListCatalogType,
  entity: { displayName: string },
  id: string,
): CatalogDependent {
  return {
    catalogType,
    id,
    displayName: dependentName(entity.displayName, id),
  };
}

function skillReferencesStatus(skill: SkillDefinition, statusId: string): boolean {
  return (
    skill.coefficients.appliesStatus === statusId ||
    skill.stagger?.statusBuildup?.status === statusId
  );
}

function elementReferencesElement(element: ElementDefinition, elementId: string): boolean {
  if (element.elementId === elementId) {
    return false;
  }

  return (
    Object.prototype.hasOwnProperty.call(element.strongAgainst, elementId) ||
    Object.prototype.hasOwnProperty.call(element.weakAgainst, elementId)
  );
}

function requiredSnapshotTypes(catalogType: CatalogType): ListCatalogType[] {
  switch (catalogType) {
    case 'class':
    case 'status':
      return ['skill'];
    case 'element':
      return ['skill', 'element'];
    case 'resonance':
      return ['class'];
    default:
      return [];
  }
}

export function isSnapshotReadyFor(
  catalogType: CatalogType,
  ready: CatalogReadiness,
): boolean {
  return requiredSnapshotTypes(catalogType).every((type) => ready[type]);
}

export function findCatalogDependents(
  catalogType: CatalogType,
  entityId: string,
  snapshot: CatalogEntriesSnapshot,
): CatalogDependent[] {
  if (entityId.trim() === '') {
    return [];
  }

  switch (catalogType) {
    case 'class':
      return (snapshot.skill ?? [])
        .filter((skill) => skill.classId === entityId)
        .map((skill) => toDependent('skill', skill, getEntityId(skill, 'skill')));
    case 'status':
      return (snapshot.skill ?? [])
        .filter((skill) => skillReferencesStatus(skill, entityId))
        .map((skill) => toDependent('skill', skill, getEntityId(skill, 'skill')));
    case 'element':
      return [
        ...(snapshot.skill ?? [])
          .filter((skill) => skill.coefficients.element === entityId)
          .map((skill) => toDependent('skill', skill, getEntityId(skill, 'skill'))),
        ...(snapshot.element ?? [])
          .filter((element) => elementReferencesElement(element, entityId))
          .map((element) => toDependent('element', element, getEntityId(element, 'element'))),
      ];
    case 'resonance':
      return (snapshot.class ?? [])
        .filter((classEntry) => classEntry.resonance === entityId)
        .map((classEntry) => toDependent('class', classEntry, getEntityId(classEntry, 'class')));
    default:
      return [];
  }
}
