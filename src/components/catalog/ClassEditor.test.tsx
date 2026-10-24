import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import { ClassEditor } from './ClassEditor';
import type { ClassDefinition } from '../../types/catalog';
import { createDefaultClass } from '../../lib/catalogDefaults';

const mockClass: ClassDefinition = {
  classId: 'vanguard',
  displayName: 'Vanguard',
  description: 'A stalwart frontline defender.',
  primaryResource: 'resolve',
  startingStats: {
    strength: 12,
    finesse: 7,
    vitality: 12,
    intellect: 4,
    precision: 6,
    luck: 5,
    tech: 4,
    hp: 150,
    resourcePool: 100,
    armor: 20,
    attackPower: 26,
    spellPower: 9,
    movementSpeed: 5,
  },
  resonance: 'valor',
  roles: ['tank', 'dps'],
};

describe('ClassEditor', () => {
  it('shows the class id field and reports validation errors next to it', () => {
    render(
      <ClassEditor
        classData={createDefaultClass()}
        onUpdate={vi.fn()}
        idError="ID is required"
      />,
    );

    const idInput = screen.getByRole('textbox', { name: 'Class ID' });
    expect(idInput).toHaveValue('');
    expect(idInput).toHaveAccessibleDescription('ID is required');
    expect(screen.getByText('ID is required')).toBeInTheDocument();
  });

  it('calls onUpdate when the class id changes', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<ClassEditor classData={mockClass} onUpdate={onUpdate} />);

    await user.type(screen.getByRole('textbox', { name: 'Class ID' }), 'x');

    expect(onUpdate).toHaveBeenCalled();
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.classId).toBe('vanguardx');
    expect(lastCall.startingStats.strength).toBe(12);
  });
});
