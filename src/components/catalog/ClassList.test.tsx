import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClassList } from './ClassList';
import type { ClassDefinition } from '../../types/catalog';

const mockClasses: ClassDefinition[] = [
  {
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
      movementSpeed: 5.0,
    },
    resonance: 'valor',
    roles: ['tank', 'dps'],
  },
  {
    classId: 'ranger',
    displayName: 'Ranger',
    description: 'A precise marksman.',
    primaryResource: 'focus',
    startingStats: {
      strength: 6,
      finesse: 11,
      vitality: 6,
      intellect: 4,
      precision: 13,
      luck: 7,
      tech: 3,
      hp: 100,
      resourcePool: 100,
      armor: 8,
      attackPower: 14,
      spellPower: 9,
      movementSpeed: 5.5,
    },
    resonance: 'precision',
    roles: ['dps'],
  },
];

describe('ClassList', () => {
  it('renders loading state', () => {
    render(
      <ClassList
        classes={undefined}
        selectedClassId={null}
        onSelectClass={vi.fn()}
        isLoading={true}
        error={null}
      />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const error = new Error('Failed to fetch');
    render(
      <ClassList
        classes={undefined}
        selectedClassId={null}
        onSelectClass={vi.fn()}
        isLoading={false}
        error={error}
      />
    );

    expect(screen.getByText(/Failed to load classes/)).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(
      <ClassList
        classes={[]}
        selectedClassId={null}
        onSelectClass={vi.fn()}
        isLoading={false}
        error={null}
      />
    );

    expect(screen.getByText(/No classes found/)).toBeInTheDocument();
  });

  it('renders list of classes', () => {
    render(
      <ClassList
        classes={mockClasses}
        selectedClassId={null}
        onSelectClass={vi.fn()}
        isLoading={false}
        error={null}
      />
    );

    expect(screen.getByText('Vanguard')).toBeInTheDocument();
    expect(screen.getByText('Ranger')).toBeInTheDocument();
    expect(screen.getByText('resolve')).toBeInTheDocument();
    expect(screen.getByText('focus')).toBeInTheDocument();
  });

  it('shows role chips for each class', () => {
    render(
      <ClassList
        classes={mockClasses}
        selectedClassId={null}
        onSelectClass={vi.fn()}
        isLoading={false}
        error={null}
      />
    );

    expect(screen.getByText('tank')).toBeInTheDocument();
    expect(screen.getAllByText('dps')).toHaveLength(2);
  });

  it('calls onSelectClass when class is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <ClassList
        classes={mockClasses}
        selectedClassId={null}
        onSelectClass={handleSelect}
        isLoading={false}
        error={null}
      />
    );

    await user.click(screen.getByText('Vanguard'));

    expect(handleSelect).toHaveBeenCalledWith('vanguard');
  });

  it('highlights selected class', () => {
    render(
      <ClassList
        classes={mockClasses}
        selectedClassId="vanguard"
        onSelectClass={vi.fn()}
        isLoading={false}
        error={null}
      />
    );

    const vanguardButton = screen.getByRole('button', { name: /Vanguard/ });
    expect(vanguardButton).toHaveClass('Mui-selected');
  });
});
