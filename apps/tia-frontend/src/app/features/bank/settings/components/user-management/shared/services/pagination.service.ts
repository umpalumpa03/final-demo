import { computed, effect, inject, signal, Signal } from '@angular/core';
import { BreakpointService } from '@tia/core/services/breakpoints/breakpoint.service';
import { PaginationConfig } from '@tia/shared/lib/navigation/models/pagination.model';

const PAGE_SIZES = {
  xsMobile: 2,
  mobile: 3,
  desktop: 4,
} as const;

export function usePagination<T>(items: Signal<T[]>) {
  const breakpointService = inject(BreakpointService);

  const currentPage = signal<number>(1);

  const pageSize = computed(() => {
    if (breakpointService.isXsMobile()) return PAGE_SIZES.xsMobile;
    if (breakpointService.isMobile()) return PAGE_SIZES.mobile;
    return PAGE_SIZES.desktop;
  });

  const totalPages = computed(() => {
    const total = items().length;
    const size = pageSize();
    return total === 0 ? 1 : Math.ceil(total / size);
  });

  const visibleItems = computed(() => {
    const page = currentPage();
    const size = pageSize();
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    return items().slice(startIndex, endIndex);
  });

  effect(() => {
    const total = totalPages();
    const current = currentPage();
    if (total > 0 && current > total) {
      currentPage.set(total);
    }
  });

  const paginationConfig = computed<PaginationConfig>(() => {
    const isMobile = breakpointService.isMobile() || breakpointService.isXsMobile();
    const isTablet = breakpointService.isTablet();

    const maxVisiblePages = 5;

    if (isMobile) {
      return {
        maxVisiblePages: 1,
        showEllipsis: true,
        previousLabel: ' ',
        nextLabel: ' ',
      };
    }

    if (isTablet) {
      return {
        maxVisiblePages,
        showEllipsis: true,
        previousLabel: 'Prev',
        nextLabel: 'Next',
      };
    }

    return {
      maxVisiblePages,
      showEllipsis: true,
      previousLabel: 'Previous',
      nextLabel: 'Next',
    };
  });

  const skeletonCount = computed(() =>
    Array.from({ length: pageSize() }, (_, i) => i + 1)
  );

  const setPage = (page: number) => currentPage.set(page);

  return {
    currentPage,
    totalPages,
    visibleItems,
    setPage,
    paginationConfig,
    pageSize,
    skeletonCount,
  };
}