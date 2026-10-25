import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '../../../test/test-utils';
import { AddEntryDialog } from './AddEntryDialog';

function dialogContent(dialog: HTMLElement): HTMLElement {
  const form = dialog.querySelector('form');
  if (!form?.parentElement) {
    throw new Error('Expected the add-entry form to be inside dialog content');
  }
  return form.parentElement;
}

describe('AddEntryDialog', () => {
  it('pads dialog content so the first outlined label is not clipped', () => {
    render(
      <AddEntryDialog
        open
        catalogType="combat-constants"
        existingIds={[]}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: /add combat constants/i });
    expect(
      within(dialog).getByRole('spinbutton', { name: 'Physical Strength Multiplier' }),
    ).toBeInTheDocument();

    const paddingTop = Number.parseFloat(getComputedStyle(dialogContent(dialog)).paddingTop);
    expect(paddingTop).toBeGreaterThan(0);
  });

  it('keeps top padding on every add dialog, including Class', () => {
    render(
      <AddEntryDialog
        open
        catalogType="class"
        existingIds={[]}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: /add class/i });
    expect(within(dialog).getByRole('textbox', { name: 'Class ID' })).toBeInTheDocument();

    const paddingTop = Number.parseFloat(getComputedStyle(dialogContent(dialog)).paddingTop);
    expect(paddingTop).toBeGreaterThan(0);
  });
});
