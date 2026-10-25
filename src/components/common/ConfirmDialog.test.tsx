import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('requires confirmation before the destructive action', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        open
        title="Delete class?"
        description='Delete "Vanguard" from this draft? This only affects the working copy.'
        confirmLabel="Delete"
        confirmColor="error"
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByRole('dialog', { name: /delete class/i })).toBeInTheDocument();
    expect(screen.getByText(/only affects the working copy/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('confirms when the confirm action is chosen', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        open
        title="Delete class?"
        description='Delete "Ranger" from this draft?'
        confirmLabel="Delete"
        confirmColor="error"
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole('button', { name: /^delete$/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('hides the confirm action when the request is blocked', () => {
    render(
      <ConfirmDialog
        open
        title="Cannot delete class"
        description="The last class cannot be deleted."
        closeLabel="Close"
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^delete$/i })).not.toBeInTheDocument();
  });
});
