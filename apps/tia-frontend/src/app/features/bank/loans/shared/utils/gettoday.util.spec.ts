import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { getTodayDate } from './gettoday.util';

describe('getTodayDate Util', () => {
  beforeEach(() => {
    const mockDate = new Date(2026, 0, 15);
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return the current date in YYYY-MM-DD format', () => {
    const result = getTodayDate();
    expect(result).toBe('2026-01-14');
  });
});
