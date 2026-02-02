import { signal } from '@angular/core';
import { usePagination } from './pagination.service';
import { describe, it, expect } from 'vitest';

describe('usePagination', () => {
  it('should handle pagination logic', () => {
    const items = signal([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const pagination = usePagination(items, 4);

    expect(pagination.totalPages()).toBe(3);
    expect(pagination.visibleItems()).toEqual([1, 2, 3, 4]);

    pagination.setPage(2);
    expect(pagination.currentPage()).toBe(2);
    expect(pagination.visibleItems()).toEqual([5, 6, 7, 8]);
  });

  it('should handle empty items', () => {
    const items = signal([]);
    const pagination = usePagination(items, 4);
    expect(pagination.totalPages()).toBe(1);
    expect(pagination.visibleItems()).toEqual([]);
  });
});
