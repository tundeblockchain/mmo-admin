import {
  CLASS_ROLES,
  PRIMARY_RESOURCES,
  SKILL_KINDS,
  STATUS_CATEGORIES,
} from '../catalogSchema';
import type { AddEntryConfig } from './types';

export const CLASS_ADD_ENTRY_CONFIG: AddEntryConfig = {
  catalogType: 'class',
  title: 'Add Class',
  entityLabel: 'Class',
  fields: [
    {
      key: 'classId',
      label: 'Class ID',
      kind: 'text',
      required: true,
      idField: true,
      helperText: 'Unique identifier for this class (e.g. vanguard).',
    },
    { key: 'displayName', label: 'Display Name', kind: 'text' },
    { key: 'description', label: 'Description', kind: 'textarea' },
    {
      key: 'primaryResource',
      label: 'Primary Resource',
      kind: 'select',
      options: PRIMARY_RESOURCES,
    },
    { key: 'resonance', label: 'Resonance', kind: 'catalog-select', catalogType: 'resonance' },
    { key: 'roles', label: 'Roles', kind: 'multiselect', options: CLASS_ROLES },
  ],
};

export const SKILL_ADD_ENTRY_CONFIG: AddEntryConfig = {
  catalogType: 'skill',
  title: 'Add Skill',
  entityLabel: 'Skill',
  fields: [
    {
      key: 'skillId',
      label: 'Skill ID',
      kind: 'text',
      required: true,
      idField: true,
      helperText: 'Unique identifier for this skill (e.g. vanguard_cleaving_strike).',
    },
    { key: 'displayName', label: 'Display Name', kind: 'text' },
    { key: 'description', label: 'Description', kind: 'textarea' },
    {
      key: 'classId',
      label: 'Class',
      kind: 'catalog-select',
      catalogType: 'class',
      required: true,
    },
    { key: 'kind', label: 'Kind', kind: 'select', options: SKILL_KINDS },
  ],
};

export const STATUS_ADD_ENTRY_CONFIG: AddEntryConfig = {
  catalogType: 'status',
  title: 'Add Status',
  entityLabel: 'Status',
  fields: [
    {
      key: 'statusId',
      label: 'Status ID',
      kind: 'text',
      required: true,
      idField: true,
      helperText: 'Unique identifier for this status (e.g. flame).',
    },
    { key: 'displayName', label: 'Display Name', kind: 'text' },
    { key: 'description', label: 'Description', kind: 'textarea' },
    { key: 'category', label: 'Category', kind: 'select', options: STATUS_CATEGORIES },
    { key: 'maxStacks', label: 'Max Stacks', kind: 'number', step: 1 },
  ],
};

export const ELEMENT_ADD_ENTRY_CONFIG: AddEntryConfig = {
  catalogType: 'element',
  title: 'Add Element',
  entityLabel: 'Element',
  fields: [
    {
      key: 'elementId',
      label: 'Element ID',
      kind: 'text',
      required: true,
      idField: true,
      helperText: 'Unique identifier for this element (e.g. fire).',
    },
    { key: 'displayName', label: 'Display Name', kind: 'text' },
    {
      key: 'color',
      label: 'Color (hex)',
      kind: 'hex',
      helperText: 'Color must be a hex value (e.g. #FF4500).',
    },
  ],
};

export const RESONANCE_ADD_ENTRY_CONFIG: AddEntryConfig = {
  catalogType: 'resonance',
  title: 'Add Resonance',
  entityLabel: 'Resonance',
  fields: [
    {
      key: 'resonanceId',
      label: 'Resonance ID',
      kind: 'text',
      required: true,
      idField: true,
      helperText: 'Unique identifier for this resonance (e.g. valor).',
    },
    { key: 'displayName', label: 'Display Name', kind: 'text' },
    { key: 'description', label: 'Description', kind: 'textarea' },
  ],
};
