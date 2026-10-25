import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import { createDraft } from '../../hooks/useDraftCatalog';
import { mockEmptyCatalogApi } from '../../test/emptyCatalogTestUtils';
import { mockClassCatalog } from '../../test/mocks/catalog-fixtures';
import { CatalogReferenceSelect } from './CatalogReferenceSelect';

function renderClassSelect(value = '') {
  const onChange = vi.fn();
  render(
    <CatalogReferenceSelect
      catalogType="class"
      label="Class"
      labelId="class-options-label"
      value={value}
      onChange={onChange}
    />,
  );
  return { onChange };
}

describe('CatalogReferenceSelect', () => {
  it('lists catalog class options and reports the selected id', async () => {
    const user = userEvent.setup();
    const { onChange } = renderClassSelect();

    await user.click(await screen.findByRole('combobox', { name: 'Class' }));
    expect(await screen.findByRole('option', { name: 'Vanguard' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ranger' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'arcanist' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'Ranger' }));
    expect(onChange).toHaveBeenCalledWith('ranger');
  });

  it('merges draft and published class options in the menu', async () => {
    createDraft('class', 2, [
      { ...mockClassCatalog.data[0], displayName: 'Vanguard Draft' },
      { ...mockClassCatalog.data[0], classId: 'warden', displayName: 'Warden' },
    ]);

    const user = userEvent.setup();
    renderClassSelect();

    await user.click(await screen.findByRole('combobox', { name: 'Class' }));
    expect(await screen.findByRole('option', { name: 'Vanguard Draft' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Warden' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ranger' })).toBeInTheDocument();
  });

  it('disables the field and links to the class catalog when empty', async () => {
    mockEmptyCatalogApi();
    renderClassSelect();

    const field = await screen.findByRole('combobox', { name: 'Class' });
    expect(field).toHaveAttribute('aria-disabled', 'true');
    expect(await screen.findByText(/add a class first/i)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Classes' });
    expect(link).toHaveAttribute('href', '/catalog/classes');
  });
});
