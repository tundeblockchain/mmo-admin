import type { ResourceEffect, ScalingVector, SkillConditional } from '../../../types/catalog';

export function createResourceEffect(): ResourceEffect {
  return {
    resourceId: '',
    amount: 0,
    isPercentOfMax: false,
  };
}

export function createConditional(): SkillConditional {
  return { condition: 'marked' };
}

export function createScaling(): ScalingVector {
  return { stat: 'attackPower', coefficient: 1 };
}
