import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import { DeleteEntryDialog } from './DeleteEntryDialog';
import { lastEntryDeleteMessage } from '../../lib/evaluateCatalogDelete';

const pending = {
  displayName: 'Vanguard',
  kindLabel: 'class',
};

describe('DeleteEntryDialog', () => {
  it('asks for confirmation when the entry can be removed', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <DeleteEntryDialog
        pending={{ displayName: 'Ranger', kindLabel: 'class' }}
        evaluation={{ status: 'confirm' }}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByRole('dialog', { name: /delete class/i })).toBeInTheDocument();
    expect(screen.getByText(/only affects the working copy/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^delete$/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('lists dependents and does not offer delete', () => {
    render(
      <DeleteEntryDialog
        pending={pending}
        evaluation={{
          status: 'blocked',
          dependents: [
            {
              catalogType: 'skill',
              id: 'vanguard_cleaving_strike',
              displayName: 'Cleaving Strike',
            },
          ],
        }}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog', { name: /cannot delete class/i })).toBeInTheDocument();
    expect(screen.getByText('Cleaving Strike')).toBeInTheDocument();
    expect(screen.getByText('Skill')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^delete$/i })).not.toBeInTheDocument();
  });

  it('blocks the last entry with a clear message', () => {
    render(
      <DeleteEntryDialog
        pending={{ displayName: 'Cleaving Strike', kindLabel: 'skill' }}
        evaluation={{ status: 'last-entry', message: lastEntryDeleteMessage('skill') }}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog', { name: /cannot delete skill/i })).toBeInTheDocument();
    expect(
      screen.getByText(/the last skill cannot be deleted/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^delete$/i })).not.toBeInTheDocument();
  });
});
