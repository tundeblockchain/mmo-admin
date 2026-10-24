export function formatPercentDisplay(value: number): string {
  return String(+(value * 100).toFixed(6));
}

export function toStoredDecimal(percent: number): number {
  return Number((percent / 100).toFixed(6));
}

export function parseFiniteNumber(raw: string): number | null {
  if (raw.trim() === '') {
    return null;
  }
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : null;
}
