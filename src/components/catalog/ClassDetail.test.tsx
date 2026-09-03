import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClassDetail } from './ClassDetail';
import type { ClassDefinition } from '../../types/catalog';

const mockClass: ClassDefinition = {
  classId: 'vanguard',
  displayName: 'Vanguard',
  description: 'A stalwart frontline defender who protects allies.',
  primaryResource: 'resolve',
  secondaryResource: undefined,
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
};

describe('ClassDetail', () => {
  it('shows placeholder when no class is selected', () => {
    render(<ClassDetail classData={null} />);

    expect(screen.getByText(/Select a class to view details/)).toBeInTheDocument();
  });

  it('displays class name and description', () => {
    render(<ClassDetail classData={mockClass} />);

    expect(screen.getByRole('heading', { name: 'Vanguard' })).toBeInTheDocument();
    expect(screen.getByText(/stalwart frontline defender/)).toBeInTheDocument();
  });

  it('displays class roles', () => {
    render(<ClassDetail classData={mockClass} />);

    expect(screen.getByText('tank')).toBeInTheDocument();
    expect(screen.getByText('dps')).toBeInTheDocument();
  });

  it('displays primary resource and resonance', () => {
    render(<ClassDetail classData={mockClass} />);

    expect(screen.getByText(/Primary Resource:/)).toBeInTheDocument();
    expect(screen.getByText('resolve')).toBeInTheDocument();
    expect(screen.getByText(/Resonance:/)).toBeInTheDocument();
    expect(screen.getByText('valor')).toBeInTheDocument();
  });

  it('displays primary stats', () => {
    render(<ClassDetail classData={mockClass} />);

    expect(screen.getByText('Strength')).toBeInTheDocument();
    expect(screen.getAllByText('12').length).toBeGreaterThan(0);
    expect(screen.getByText('Finesse')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('displays derived stats', () => {
    render(<ClassDetail classData={mockClass} />);

    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Armor')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });
});
