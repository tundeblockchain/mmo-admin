import { useCallback, useRef, useState } from 'react';
import { formatPercentDisplay, parseFiniteNumber, toStoredDecimal } from './percentUtils';

export function usePercentDraft(
  value: number | undefined,
  onFinite: (stored: number) => void,
  onEmpty?: () => void,
) {
  const lastCommittedRef = useRef(value);
  const [text, setText] = useState(() =>
    value === undefined ? '' : formatPercentDisplay(value),
  );

  if (lastCommittedRef.current !== value) {
    lastCommittedRef.current = value;
    const nextText = value === undefined ? '' : formatPercentDisplay(value);
    if (text !== nextText) {
      setText(nextText);
    }
  }

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextText = event.target.value;
      setText(nextText);

      if (nextText.trim() === '') {
        onEmpty?.();
        return;
      }

      const parsed = parseFiniteNumber(nextText);
      if (parsed === null) {
        return;
      }

      const stored = toStoredDecimal(parsed);
      lastCommittedRef.current = stored;
      onFinite(stored);
    },
    [onEmpty, onFinite],
  );

  return { text, handleChange };
}
