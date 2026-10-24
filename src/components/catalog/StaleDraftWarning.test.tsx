import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import { StaleDraftWarning } from './StaleDraftWarning';

describe('StaleDraftWarning', () => {
  it('warns that publishing would build on an older version', async () => {
    const user = userEvent.setup();
    const onKeepEditing = vi.fn();
    const onDiscard = vi.fn();

    render(
      <StaleDraftWarning
        sourceVersion={1}
        latestVersion={2}
        onKeepEditing={onKeepEditing}
        onDiscard={onDiscard}
      />,
    );

    expect(
      screen.getByRole('alert', { name: /based on an older version/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/publishing would build on an older version/i)).toBeInTheDocument();
    expect(screen.getByText(/was not merged/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /keep editing/i }));
    expect(onKeepEditing).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /discard draft/i }));
    expect(onDiscard).toHaveBeenCalledTimes(1);
  });
});
