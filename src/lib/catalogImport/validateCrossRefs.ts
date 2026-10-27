import { UNKNOWN_REF_ERROR } from '../catalogSchema';
import { getEntityId } from '../catalogIds';
import type { ClassDefinition, ElementDefinition, SkillDefinition } from '../../types/catalog';
import { pushError } from './parseHelpers';
import type { CatalogBundle, FieldError } from './types';

export function collectCrossRefErrors(bundle: CatalogBundle): FieldError[] {
  const errors: FieldError[] = [];
  const classIds = new Set((bundle.class ?? []).map((entry) => entry.classId));
  const resonanceIds = new Set((bundle.resonance ?? []).map((entry) => entry.resonanceId));
  const elementIds = new Set((bundle.element ?? []).map((entry) => entry.elementId));
  const statusIds = new Set((bundle.status ?? []).map((entry) => entry.statusId));

  (bundle.class ?? []).forEach((entry, index) => {
    validateClassRefs(entry, index, resonanceIds, errors);
  });
  (bundle.skill ?? []).forEach((skill, index) => {
    validateSkillRefs(skill, index, classIds, elementIds, statusIds, errors);
  });
  (bundle.element ?? []).forEach((element, index) => {
    validateElementRefs(element, index, elementIds, errors);
  });

  return errors;
}

function validateClassRefs(
  entry: ClassDefinition,
  index: number,
  resonanceIds: Set<string>,
  errors: FieldError[],
): void {
  if (resonanceIds.size > 0 && !resonanceIds.has(entry.resonance)) {
    pushError(errors, `class.${index}.resonance`, UNKNOWN_REF_ERROR);
  }
}

function validateSkillRefs(
  skill: SkillDefinition,
  index: number,
  classIds: Set<string>,
  elementIds: Set<string>,
  statusIds: Set<string>,
  errors: FieldError[],
): void {
  if (classIds.size > 0 && !classIds.has(skill.classId)) {
    pushError(errors, `skill.${index}.classId`, UNKNOWN_REF_ERROR);
  }
  const element = skill.coefficients.element;
  if (element && elementIds.size > 0 && !elementIds.has(element)) {
    pushError(errors, `skill.${index}.coefficients.element`, UNKNOWN_REF_ERROR);
  }
  const status = skill.coefficients.appliesStatus;
  if (status && statusIds.size > 0 && !statusIds.has(status)) {
    pushError(errors, `skill.${index}.coefficients.appliesStatus`, UNKNOWN_REF_ERROR);
  }
  const buildup = skill.stagger?.statusBuildup?.status;
  if (buildup && statusIds.size > 0 && !statusIds.has(buildup)) {
    pushError(errors, `skill.${index}.stagger.statusBuildup.status`, UNKNOWN_REF_ERROR);
  }
}

function validateElementRefs(
  element: ElementDefinition,
  index: number,
  elementIds: Set<string>,
  errors: FieldError[],
): void {
  Object.keys(element.strongAgainst).forEach((key) => {
    if (!elementIds.has(key)) {
      pushError(errors, `element.${index}.strongAgainst.${key}`, UNKNOWN_REF_ERROR);
    }
  });
  Object.keys(element.weakAgainst).forEach((key) => {
    if (!elementIds.has(key)) {
      pushError(errors, `element.${index}.weakAgainst.${key}`, UNKNOWN_REF_ERROR);
    }
  });
}

export function entityIdsForType(
  bundle: CatalogBundle,
  catalogType: 'class' | 'skill' | 'status' | 'element' | 'resonance',
): string[] {
  const data = bundle[catalogType];
  if (!data) {
    return [];
  }
  return data.map((entity) => getEntityId(entity, catalogType));
}
