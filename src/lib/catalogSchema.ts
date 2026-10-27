export const CLASS_IDS = [
  'vanguard',
  'ranger',
  'arcanist',
  'machinist',
  'warden',
  'shade',
] as const;

export const PRIMARY_RESOURCES = [
  'resolve',
  'focus',
  'mana',
  'charge',
  'radiance',
  'momentum',
] as const;

export const RESOURCE_IDS = [...PRIMARY_RESOURCES, 'judgement'] as const;

export const SECONDARY_RESOURCES = ['judgement'] as const;

export const RESONANCE_IDS = [
  'valor',
  'precision',
  'arcana',
  'innovation',
  'sanctuary',
  'subterfuge',
] as const;

export const CLASS_ROLES = ['tank', 'healer', 'dps', 'support'] as const;

export const SKILL_KINDS = ['active', 'passive', 'reaction'] as const;

export const ELEMENT_IDS = [
  'physical',
  'fire',
  'ice',
  'lightning',
  'arcane',
  'nature',
  'shadow',
  'radiant',
] as const;

export const SCALING_STATS = [
  'attackPower',
  'spellPower',
  'techPower',
  'devicePower',
  'healingPower',
  'maxHp',
  'missingHp',
  'missingHpPercent',
  'armor',
  'level',
  'strength',
  'finesse',
  'vitality',
  'intellect',
  'precision',
  'luck',
  'tech',
] as const;

export const ACTIVE_PHASE_TYPES = [
  'standard',
  'hold',
  'stance',
  'reaction',
  'deploy',
  'buff',
  'summon',
  'channel',
] as const;

export const SKILL_CONDITIONS = [
  'marked',
  'below_hp_threshold',
  'above_hp_threshold',
  'perfect_timing',
  'flanking',
  'stealthed',
  'boss_target',
] as const;

export const STATUS_CATEGORIES = ['buff', 'debuff', 'dot', 'hot', 'control'] as const;

export const INTEGER_ERROR = 'Must be an integer';
export const NUMBER_ERROR = 'Must be a number';
export const REQUIRED_ERROR = 'This field is required';
export const ENUM_ERROR = 'Select a valid value';
export const HEX_COLOR_ERROR = 'Color must be a hex value (e.g. #FF4500)';
export const RANGE_0_1_ERROR = 'Must be between 0 and 1';
export const STRING_ERROR = 'Must be a string';
export const BOOLEAN_ERROR = 'Must be a boolean';
export const ARRAY_ERROR = 'Must be an array';
export const OBJECT_ERROR = 'Must be an object';
export const UNKNOWN_REF_ERROR = 'Referenced id does not exist';
export const EMPTY_CATALOG_JSON_ERROR = 'Catalog JSON must include at least one catalog type';
export const EMPTY_LIST_PUBLISH_MESSAGE =
  'Empty list arrays cannot be published. The server returns 400.';

export const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
