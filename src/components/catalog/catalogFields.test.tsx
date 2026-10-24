import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import { OptionalPercentField, PercentField } from './catalogFields';

function mountPercentField(initial: number) {
  const onChange = vi.fn();

  function Harness() {
    const [value, setValue] = useState(initial);
    return (
      <PercentField
        label="Bonus"
        value={value}
        onChange={(next) => {
          onChange(next);
          setValue(next);
        }}
      />
    );
  }

  render(<Harness />);
  return { onChange };
}

describe('PercentField', () => {
  it('stores 2.5% as 0.025 and keeps 2.5 in the input', async () => {
    const user = userEvent.setup();
    const { onChange } = mountPercentField(0);

    const input = screen.getByRole('spinbutton', { name: 'Bonus (%)' });
    await user.clear(input);
    await user.type(input, '2.5');

    expect(onChange).toHaveBeenLastCalledWith(0.025);
    expect(input).toHaveValue(2.5);
  });

  it('round-trips 0.005 as 0.5%', async () => {
    const user = userEvent.setup();
    const { onChange } = mountPercentField(0.005);

    const input = screen.getByRole('spinbutton', { name: 'Bonus (%)' });
    expect(input).toHaveValue(0.5);

    await user.clear(input);
    await user.type(input, '0.5');

    expect(onChange).toHaveBeenLastCalledWith(0.005);
    expect(input).toHaveValue(0.5);
  });

  it('does not write 0 when the field is cleared mid-edit', async () => {
    const user = userEvent.setup();
    const { onChange } = mountPercentField(0.07);

    const input = screen.getByRole('spinbutton', { name: 'Bonus (%)' });
    await user.clear(input);

    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue(null);
  });

  it('stores 7% as exactly 0.07', async () => {
    const user = userEvent.setup();
    const { onChange } = mountPercentField(0);

    const input = screen.getByRole('spinbutton', { name: 'Bonus (%)' });
    await user.clear(input);
    await user.type(input, '7');

    expect(onChange).toHaveBeenLastCalledWith(0.07);
    expect(input).toHaveValue(7);
  });
});

describe('OptionalPercentField', () => {
  it('clears to undefined without writing 0', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function Harness() {
      const [value, setValue] = useState<number | undefined>(0.07);
      return (
        <OptionalPercentField
          label="Dodge"
          value={value}
          onChange={(next) => {
            onChange(next);
            setValue(next);
          }}
        />
      );
    }

    render(<Harness />);
    const input = screen.getByRole('spinbutton', { name: 'Dodge (%)' });
    await user.clear(input);

    expect(onChange).toHaveBeenCalledWith(undefined);
    expect(onChange).not.toHaveBeenCalledWith(0);
    expect(input).toHaveValue(null);
  });
});
