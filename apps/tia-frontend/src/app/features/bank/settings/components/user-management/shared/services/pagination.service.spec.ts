import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BreakpointService } from '@tia/core/services/breakpoints/breakpoint.service';
import { usePagination } from './pagination.service';
import { describe, it, expect, beforeEach } from 'vitest';

function createMockBreakpointService(overrides: {
  isExtraSmall?: boolean;
  isXsMobile?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
} = {}) {
  return {
    isExtraSmall: () => overrides.isExtraSmall ?? false,
    isXsMobile: () => overrides.isXsMobile ?? false,
    isMobile: () => overrides.isMobile ?? true,
    isTablet: () => overrides.isTablet ?? false,
  };
}

describe('usePagination', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BreakpointService,
          useValue: createMockBreakpointService({ isMobile: true, isTablet: false }),
        },
      ],
    });
  });

  it('should handle pagination logic with responsive page size', () => {
    const items = signal([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const pagination = TestBed.runInInjectionContext(() => usePagination(items));

    expect(pagination.pageSize()).toBe(3);
    expect(pagination.totalPages()).toBe(3);
    expect(pagination.visibleItems()).toEqual([1, 2, 3]);

    pagination.setPage(2);
    expect(pagination.currentPage()).toBe(2);
    expect(pagination.visibleItems()).toEqual([4, 5, 6]);

    pagination.setPage(3);
    expect(pagination.visibleItems()).toEqual([7, 8, 9]);
  });

  it('should handle empty items', () => {
    const items = signal<number[]>([]);
    const pagination = TestBed.runInInjectionContext(() => usePagination(items));
    expect(pagination.totalPages()).toBe(1);
    expect(pagination.visibleItems()).toEqual([]);
    expect(pagination.currentPage()).toBe(1);
  });

  it('should clamp current page when total pages shrinks (effect)', () => {
    const items = signal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const pagination = TestBed.runInInjectionContext(() => usePagination(items));
    pagination.setPage(3);
    expect(pagination.currentPage()).toBe(3);
    items.set([1, 2]);
    TestBed.tick();
    expect(pagination.currentPage()).toBe(1);
  });

  it('should return mobile paginationConfig when isMobile', () => {
    const items = signal([1, 2, 3]);
    const pagination = TestBed.runInInjectionContext(() => usePagination(items));
    const config = pagination.paginationConfig();
    expect(config.maxVisiblePages).toBe(1);
    expect(config.showEllipsis).toBe(true);
    expect(config.previousLabel).toBe(' ');
    expect(config.nextLabel).toBe(' ');
  });

  it('should return tablet paginationConfig when isTablet', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BreakpointService,
          useValue: createMockBreakpointService({ isMobile: false, isTablet: true }),
        },
      ],
    });
    const items = signal([1, 2, 3]);
    const pagination = TestBed.runInInjectionContext(() => usePagination(items));
    const config = pagination.paginationConfig();
    expect(config.maxVisiblePages).toBe(5);
    expect(config.previousLabel).toBe('Prev');
    expect(config.nextLabel).toBe('Next');
  });

  it('should return desktop paginationConfig when not mobile or tablet', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BreakpointService,
          useValue: createMockBreakpointService({ isMobile: false, isTablet: false }),
        },
      ],
    });
    const items = signal([1, 2, 3]);
    const pagination = TestBed.runInInjectionContext(() => usePagination(items));
    const config = pagination.paginationConfig();
    expect(config.maxVisiblePages).toBe(5);
    expect(config.previousLabel).toBe('Previous');
    expect(config.nextLabel).toBe('Next');
  });

  it('should return xsMobile page size when isXsMobile', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BreakpointService,
          useValue: createMockBreakpointService({ isXsMobile: true, isMobile: true }),
        },
      ],
    });
    const items = signal([1, 2, 3, 4, 5]);
    const pagination = TestBed.runInInjectionContext(() => usePagination(items));
    expect(pagination.pageSize()).toBe(2);
    expect(pagination.totalPages()).toBe(3);
    expect(pagination.visibleItems()).toEqual([1, 2]);
  });


});
