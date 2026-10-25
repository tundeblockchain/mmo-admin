import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '../../../test/test-utils';
import { AddEntryForm } from './AddEntryForm';

describe('AddEntryForm', () => {
  it('renders class fields from the category config', () => {
    render(
      <AddEntryForm
        catalogType="class"
        existingIds={[]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole('textbox', { name: 'Class ID' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Display Name' })).toHaveValue('New Class');
    expect(screen.getByRole('button', { name: /add entry/i })).toBeDisabled();
  });

  it('submits a valid class and blocks duplicate ids', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <AddEntryForm
        catalogType="class"
        existingIds={['vanguard']}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    const idInput = screen.getByRole('textbox', { name: 'Class ID' });
    await user.type(idInput, 'vanguard');
    expect(screen.getByText('ID must be unique within this draft')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add entry/i })).toBeDisabled();

    await user.clear(idInput);
    await user.type(idInput, 'warden');
    await user.click(screen.getByRole('button', { name: /add entry/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        classId: 'warden',
        displayName: 'New Class',
        startingStats: expect.objectContaining({ strength: 10 }),
      }),
    );
  });

  it('renders skill and combat-constants configs', () => {
    const { rerender } = render(
      <AddEntryForm
        catalogType="skill"
        existingIds={[]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole('textbox', { name: 'Skill ID' })).toBeInTheDocument();
    expect(screen.getByLabelText('Class')).toBeInTheDocument();

    rerender(
      <AddEntryForm
        key="combat-constants"
        catalogType="combat-constants"
        existingIds={[]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole('spinbutton', { name: 'Base Crit Chance' })).toHaveValue(0.05);
    expect(screen.getByRole('button', { name: /add entry/i })).toBeEnabled();
  });

  it('shrinks catalog-select labels when the placeholder is shown', async () => {
    render(
      <AddEntryForm
        catalogType="skill"
        existingIds={[]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const classField = await screen.findByRole('combobox', { name: 'Class' });
    expect(classField).toHaveTextContent('Select…');
    expect(screen.getByText('Class', { selector: 'label' })).toHaveAttribute('data-shrink', 'true');
  });

  it('populates the skill class dropdown from the catalog', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <AddEntryForm
        catalogType="skill"
        existingIds={[]}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.type(screen.getByRole('textbox', { name: 'Skill ID' }), 'cleave');
    expect(screen.getByRole('button', { name: /add entry/i })).toBeDisabled();

    const classField = await screen.findByRole('combobox', { name: 'Class' });
    await user.click(classField);
    expect(await screen.findByRole('option', { name: 'Vanguard' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ranger' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'arcanist' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'Vanguard' }));
    await user.click(screen.getByRole('button', { name: /add entry/i }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ classId: 'vanguard' }));
  });
});
