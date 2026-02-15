import { describe, it, expect } from 'vitest';
import {
  formatDateDisplay,
  maskDateInput,
  parseDateToIso,
} from './date-input.util';

describe('DateInputUtil', () => {
  it('maskDateInput: formats, clamps, and handles cursor', () => {
    expect(maskDateInput('01012023').value).toBe('01/01/2023');
    expect(maskDateInput('01/01/2023').value).toBe('01/01/2023');

    expect(maskDateInput('35152023').value).toBe('31/12/2023');

    expect(maskDateInput('05').value).toBe('05');
    expect(maskDateInput('0505').value).toBe('05/05');
    expect(maskDateInput('05/').value).toBe('05/');

    expect(maskDateInput('0101', 4).cursor).toBe(5);
    expect(maskDateInput('01012023', 0).cursor).toBe(0);
  });

  it('parseDateToIso: converts valid dates and rejects invalid', () => {
    expect(parseDateToIso('31/12/2023')).toBe('2023-12-31');

    expect(parseDateToIso('01/01/20')).toBeNull();
    expect(parseDateToIso('')).toBeNull();

    const result = parseDateToIso('99/99/2023');
    if (result) expect(result).toBeNull();
  });

  it('formatDateDisplay: formats ISO, handles fallbacks', () => {
    expect(formatDateDisplay(null)).toBe('');

    expect(formatDateDisplay('2023-12-31')).toBe('31/12/2023');

    expect(formatDateDisplay('Hello')).toBe('Hello');
    expect(formatDateDisplay(12345)).toBe('12345');
  });
});
