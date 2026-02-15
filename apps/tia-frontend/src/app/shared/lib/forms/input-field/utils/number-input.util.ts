export function sanitizeNumberInput(originalValue: string): string {
  let cleaned = originalValue.replace(/[eE+]/g, '');

  const parts = cleaned.split('.');

  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }

  if (parts.length === 2 && parts[1].length > 2) {
    cleaned = parts[0] + '.' + parts[1].substring(0, 2);
  }

  return cleaned;
}

export function formatNumberDisplay(val: number): string {
  return val.toLocaleString('en-US', {
    useGrouping: false,
    maximumFractionDigits: 20,
  });
}
