import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import { CatalogEditorLayout } from './CatalogEditorLayout';
import { EditorAccordion } from './EditorAccordion';
import { IdentityFields } from './IdentityFields';
import { NumberField } from './NumberField';
import { OptionalNumberField } from './OptionalNumberField';
import { SelectField } from './SelectField';

describe('IdentityFields', () => {
  it('edits id, name, and description', async () => {
    const user = userEvent.setup();
    const onIdChange = vi.fn();
    const onNameChange = vi.fn();
    const onDescriptionChange = vi.fn();

    render(
      <IdentityFields
        idLabel="Class ID"
        idValue=""
        onIdChange={onIdChange}
        idError="ID is required"
        idHelperText="Lowercase id"
        nameValue="Vanguard"
        onNameChange={onNameChange}
        descriptionValue="A defender"
        onDescriptionChange={onDescriptionChange}
      />,
    );

    expect(screen.getByText('ID is required')).toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: 'Class ID' }), 'warden');
    expect(onIdChange).toHaveBeenCalled();
    await user.type(screen.getByRole('textbox', { name: 'Display Name' }), 'X');
    expect(onNameChange).toHaveBeenCalled();
    await user.type(screen.getByRole('textbox', { name: 'Description' }), '!');
    expect(onDescriptionChange).toHaveBeenCalled();
  });
});

describe('CatalogEditorLayout', () => {
  it('renders the title, description, and children', () => {
    render(
      <CatalogEditorLayout title="Class Editor" description="Edit class data.">
        <p>Editor body</p>
      </CatalogEditorLayout>,
    );

    expect(screen.getByRole('heading', { name: 'Class Editor' })).toBeInTheDocument();
    expect(screen.getByText('Edit class data.')).toBeInTheDocument();
    expect(screen.getByText('Editor body')).toBeInTheDocument();
  });
});

describe('EditorAccordion', () => {
  it('exposes the section heading as a button', async () => {
    const user = userEvent.setup();
    render(
      <EditorAccordion title="Coefficients">
        <p>Hidden until opened</p>
      </EditorAccordion>,
    );

    const trigger = screen.getByRole('button', { name: 'Coefficients' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Hidden until opened')).toBeVisible();
  });
});

describe('NumberField', () => {
  it('parses numeric input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function Harness() {
      const [value, setValue] = useState(1);
      return (
        <NumberField
          label="Unlock Level"
          value={value}
          onChange={(next) => {
            onChange(next);
            setValue(next);
          }}
        />
      );
    }

    render(<Harness />);
    const input = screen.getByRole('spinbutton', { name: 'Unlock Level' });
    await user.clear(input);
    await user.type(input, '4');
    expect(onChange).toHaveBeenLastCalledWith(4);
  });
});

describe('OptionalNumberField', () => {
  it('clears to undefined', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<OptionalNumberField label="Soft Cap" value={100} onChange={onChange} />);
    await user.clear(screen.getByRole('spinbutton', { name: 'Soft Cap' }));
    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});

describe('SelectField', () => {
  it('notifies when an option is chosen', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <SelectField
        label="Stat"
        labelId="stat-label"
        value="strength"
        onChange={onChange}
        options={['strength', 'finesse'] as const}
      />,
    );

    await user.click(screen.getByRole('combobox', { name: 'Stat' }));
    await user.click(await screen.findByRole('option', { name: 'finesse' }));
    expect(onChange).toHaveBeenCalledWith('finesse');
  });
});
