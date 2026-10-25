import { describe, expect, it } from 'vitest';
import { HEX_COLOR_ERROR, INTEGER_ERROR } from '../catalogSchema';
import { initialAddEntryValues } from './buildAddEntry';
import { validateAddEntryValues } from './validateAddEntry';

describe('validateAddEntryValues', () => {
  it('requires a unique class id using the shared id validator', () => {
    const values = initialAddEntryValues('class');

    expect(validateAddEntryValues('class', values, ['vanguard']).classId).toBe('ID is required');

    values.classId = 'vanguard';
    expect(validateAddEntryValues('class', values, ['vanguard']).classId).toBe(
      'ID must be unique within this draft',
    );

    values.classId = 'warden';
    expect(validateAddEntryValues('class', values, ['vanguard'])).toEqual({});
  });

  it('reuses status field-editor validation for max stacks', () => {
    const values = initialAddEntryValues('status');
    values.statusId = 'flame';
    values.maxStacks = 1.5;

    expect(validateAddEntryValues('status', values, []).maxStacks).toBe(INTEGER_ERROR);
  });

  it('reuses element hex-color validation', () => {
    const values = initialAddEntryValues('element');
    values.elementId = 'fire';
    values.color = 'orange';

    expect(validateAddEntryValues('element', values, []).color).toBe(HEX_COLOR_ERROR);
  });
});
