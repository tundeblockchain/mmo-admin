import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { UNKNOWN_REF_ERROR } from '../catalogSchema';
import { createDefaultClass } from '../catalogDefaults';
import { validateCatalogBundle, validateCatalogJson } from './validateBundle';

const seedPath = resolve(process.cwd(), 'seed/combat-0.1.0.json');

function validClass() {
  return { ...createDefaultClass(), classId: 'vanguard' };
}

describe('validateCatalogBundle', () => {
  it('accepts the combat-0.1.0 seed file', () => {
    const result = validateCatalogJson(readFileSync(seedPath, 'utf8'));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.bundle.skill).toHaveLength(48);
      expect(result.bundle.class).toHaveLength(6);
    }
  });

  it('returns per-field path and message errors', () => {
    const result = validateCatalogBundle({
      class: [{ ...validClass(), startingStats: { ...validClass().startingStats, hp: Number.NaN } }],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContainEqual({
        path: 'class.0.startingStats.hp',
        message: 'Must be a number',
      });
    }
  });

  it('rejects a skill whose classId is missing from the class list', () => {
    const result = validateCatalogBundle({
      class: [validClass()],
      skill: [
        {
          skillId: 'ranger_quickshot',
          classId: 'ranger',
          displayName: 'Quickshot',
          description: '',
          kind: 'active',
          resourceId: null,
          resourceCost: 0,
          cooldownSeconds: 0,
          charges: 1,
          chargeRechargeSeconds: 0,
          castTimeSeconds: 0,
          castableWhileMoving: false,
          range: 0,
          coefficients: { basePower: 1, scaling: [] },
          unlockLevel: 1,
          iconPath: '',
        },
      ],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContainEqual({
        path: 'skill.0.classId',
        message: UNKNOWN_REF_ERROR,
      });
    }
  });

  it('rejects empty JSON objects', () => {
    const result = validateCatalogBundle({});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors[0]?.message).toMatch(/at least one catalog type/i);
    }
  });
});
