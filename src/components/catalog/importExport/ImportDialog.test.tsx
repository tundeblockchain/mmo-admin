import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '../../../test/test-utils';
import { ImportDialog } from './ImportDialog';

describe('ImportDialog', () => {
  it('lists per-field import errors', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onFile = vi.fn();

    render(
      <ImportDialog
        open
        errors={[{ path: 'skill.0.classId', message: 'Referenced id does not exist' }]}
        appliedTypes={null}
        onClose={onClose}
        onFile={onFile}
      />,
    );

    expect(screen.getByRole('dialog', { name: /import catalog json/i })).toBeInTheDocument();
    expect(screen.getByText(/import failed\. the draft was not changed/i)).toBeInTheDocument();
    expect(
      screen.getByText(/skill\.0\.classId: referenced id does not exist/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('announces a successful draft load', () => {
    render(
      <ImportDialog
        open
        errors={null}
        appliedTypes={['status']}
        onClose={vi.fn()}
        onFile={vi.fn()}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(/loaded status into draft/i);
  });
});
