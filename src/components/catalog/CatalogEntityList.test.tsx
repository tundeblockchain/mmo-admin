import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import { CatalogEntityList } from './CatalogEntityList';

interface ListItem {
  id: string;
  name: string;
  group: string;
}

const items: ListItem[] = [
  { id: 'vanguard', name: 'Vanguard', group: 'tank' },
  { id: 'ranger', name: 'Ranger', group: 'dps' },
];

describe('CatalogEntityList', () => {
  it('shows a loading indicator', () => {
    render(
      <CatalogEntityList<ListItem>
        items={undefined}
        selectedId={null}
        getId={(item) => item.id}
        getDisplayName={(item) => item.name}
        untitledLabel="class"
        entityLabel="class"
        emptyNoun="classes"
        onSelect={vi.fn()}
        isLoading
        error={null}
      />,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows the error and empty states', () => {
    const { rerender } = render(
      <CatalogEntityList<ListItem>
        items={undefined}
        selectedId={null}
        getId={(item) => item.id}
        getDisplayName={(item) => item.name}
        untitledLabel="class"
        entityLabel="class"
        emptyNoun="classes"
        onSelect={vi.fn()}
        isLoading={false}
        error={new Error('Failed to fetch')}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Failed to load classes: Failed to fetch');

    rerender(
      <CatalogEntityList<ListItem>
        items={[]}
        selectedId={null}
        getId={(item) => item.id}
        getDisplayName={(item) => item.name}
        untitledLabel="class"
        entityLabel="class"
        emptyNoun="classes"
        onSelect={vi.fn()}
        isLoading={false}
        error={null}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('No classes found in this version.');
  });

  it('selects, groups, and requests delete for an entry', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onRequestDelete = vi.fn();

    render(
      <CatalogEntityList
        items={items}
        selectedId="vanguard"
        getId={(item) => item.id}
        getDisplayName={(item) => item.name}
        untitledLabel="class"
        entityLabel="class"
        emptyNoun="classes"
        onSelect={onSelect}
        isLoading={false}
        error={null}
        isDraft
        onAdd={vi.fn()}
        onRequestDelete={onRequestDelete}
        groupBy={(item) => item.group}
        renderSecondary={(item) => `${item.name} role`}
      />,
    );

    expect(screen.getByText('tank')).toBeInTheDocument();
    expect(screen.getByText('dps')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add class/i })).toBeInTheDocument();

    await user.click(screen.getByText('Ranger'));
    expect(onSelect).toHaveBeenCalledWith('ranger', 1);

    await user.click(screen.getByRole('button', { name: /delete vanguard/i }));
    expect(onRequestDelete).toHaveBeenCalledWith('vanguard', 0, 'Vanguard');
  });
});
