import { HEX_COLOR_ERROR, HEX_COLOR_PATTERN, REQUIRED_ERROR } from '../catalogSchema';
import type {
  ClassDefinition,
  ElementDefinition,
  ResonanceDefinition,
  StatusDefinition,
} from '../../types/catalog';
import { requireFinite, requireInteger, type FieldErrors } from './fieldRules';

export function getClassFieldErrors(classData: ClassDefinition): FieldErrors {
  const errors: FieldErrors = {};

  for (const [key, value] of Object.entries(classData.startingStats)) {
    requireFinite(value, errors, `startingStats.${key}`);
  }

  return errors;
}

export function getStatusFieldErrors(status: StatusDefinition): FieldErrors {
  const errors: FieldErrors = {};
  requireInteger(status.maxStacks, errors, 'maxStacks');
  return errors;
}

export function getElementFieldErrors(element: ElementDefinition): FieldErrors {
  const errors: FieldErrors = {};
  if (element.color.trim() !== '' && !HEX_COLOR_PATTERN.test(element.color)) {
    errors.color = HEX_COLOR_ERROR;
  }
  Object.entries(element.strongAgainst).forEach(([key, value]) => {
    requireFinite(value, errors, `strongAgainst.${key}`);
  });
  Object.entries(element.weakAgainst).forEach(([key, value]) => {
    requireFinite(value, errors, `weakAgainst.${key}`);
  });
  return errors;
}

export function getResonanceFieldErrors(resonance: ResonanceDefinition): FieldErrors {
  const errors: FieldErrors = {};
  resonance.partyBonus.forEach((bonus, index) => {
    if (bonus.stat.trim() === '') {
      errors[`partyBonus.${index}.stat`] = REQUIRED_ERROR;
    }
    requireFinite(bonus.bonusPercent, errors, `partyBonus.${index}.bonusPercent`);
  });
  return errors;
}
