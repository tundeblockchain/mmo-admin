import type {
  CatalogType,
  ClassDefinition,
  CombatConstantsData,
  ElementDefinition,
  ResonanceDefinition,
  SkillDefinition,
  StatusDefinition,
} from '../../types/catalog';

export type AddEntryEntity =
  | ClassDefinition
  | SkillDefinition
  | StatusDefinition
  | ElementDefinition
  | ResonanceDefinition
  | CombatConstantsData;

export type AddEntryValue = string | number | boolean | string[];
export type AddEntryValues = Record<string, AddEntryValue>;

interface AddEntryFieldBase {
  key: string;
  label: string;
  required?: boolean;
  helperText?: string;
  idField?: boolean;
}

export interface TextAddEntryField extends AddEntryFieldBase {
  kind: 'text' | 'textarea' | 'hex';
}

export interface NumberAddEntryField extends AddEntryFieldBase {
  kind: 'number';
  step?: number;
}

export interface SelectAddEntryField extends AddEntryFieldBase {
  kind: 'select';
  options: readonly string[];
}

export interface BooleanAddEntryField extends AddEntryFieldBase {
  kind: 'boolean';
}

export interface MultiSelectAddEntryField extends AddEntryFieldBase {
  kind: 'multiselect';
  options: readonly string[];
}

export type AddEntryField =
  | TextAddEntryField
  | NumberAddEntryField
  | SelectAddEntryField
  | BooleanAddEntryField
  | MultiSelectAddEntryField;

export interface AddEntryConfig {
  catalogType: CatalogType;
  title: string;
  entityLabel: string;
  fields: readonly AddEntryField[];
}
