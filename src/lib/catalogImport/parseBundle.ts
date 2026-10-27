import { ARRAY_ERROR, EMPTY_CATALOG_JSON_ERROR, OBJECT_ERROR, STRING_ERROR } from '../catalogSchema';
import type { CatalogType } from '../../types/catalog';
import { isRecord, pushError, readOptionalString } from './parseHelpers';
import { parseClassDefinition } from './parseClass';
import { parseCombatConstants } from './parseCombat';
import { parseElementDefinition, parseResonanceDefinition, parseStatusDefinition } from './parseEntities';
import { parseSkillDefinition } from './parseSkillCore';
import type { BundleParseResult, CatalogBundle, FieldError } from './types';
import { BUNDLE_LIST_TYPES } from './types';

const LIST_PARSERS = {
  class: parseClassDefinition,
  skill: parseSkillDefinition,
  status: parseStatusDefinition,
  element: parseElementDefinition,
  resonance: parseResonanceDefinition,
} as const;

export function parseCatalogJson(raw: string): BundleParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return { ok: false, errors: [{ path: '', message: 'File is not valid JSON' }] };
  }
  return parseCatalogBundle(parsed);
}

export function parseCatalogBundle(value: unknown): BundleParseResult {
  const errors: FieldError[] = [];
  if (!isRecord(value)) {
    return { ok: false, errors: [{ path: '', message: OBJECT_ERROR }] };
  }

  const versionTag = readOptionalString(value, 'versionTag', 'versionTag', errors);
  const bundle: CatalogBundle = {};
  if (versionTag !== undefined) {
    if (versionTag.trim() === '') {
      pushError(errors, 'versionTag', STRING_ERROR);
    } else {
      bundle.versionTag = versionTag;
    }
  }

  for (const catalogType of BUNDLE_LIST_TYPES) {
    parseListType(value, catalogType, bundle, errors);
  }

  if (value['combat-constants'] !== undefined) {
    const combat = parseCombatConstants(value['combat-constants'], 'combat-constants', errors);
    if (combat) {
      bundle['combat-constants'] = combat;
    }
  }

  const hasType =
    BUNDLE_LIST_TYPES.some((type) => bundle[type] !== undefined) || bundle['combat-constants'] !== undefined;
  if (!hasType) {
    pushError(errors, '', EMPTY_CATALOG_JSON_ERROR);
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, bundle };
}

function parseListType(
  value: Record<string, unknown>,
  catalogType: (typeof BUNDLE_LIST_TYPES)[number],
  bundle: CatalogBundle,
  errors: FieldError[],
): void {
  if (value[catalogType] === undefined) {
    return;
  }
  if (!Array.isArray(value[catalogType])) {
    pushError(errors, catalogType, ARRAY_ERROR);
    return;
  }

  const parser = LIST_PARSERS[catalogType];
  const items = value[catalogType].map((item, index) => parser(item, `${catalogType}.${index}`, errors));
  if (items.every((item) => item !== undefined)) {
    (bundle as Record<CatalogType, unknown>)[catalogType] = items;
  }
}
