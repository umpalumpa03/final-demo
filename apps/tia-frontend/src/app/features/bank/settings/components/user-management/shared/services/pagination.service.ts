import { computed, signal, Signal } from '@angular/core';

export function usePagination<T>(items: Signal<T[]>, pageSize = 4) {
  const currentPage = signal<number>(1);

  const totalPages = computed(() => {
    const total = items().length;
    return total === 0 ? 1 : Math.ceil(total / pageSize);
  });

  const visibleItems = computed(() => {
    const page = currentPage();
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items().slice(startIndex, endIndex);
  });

  const setPage = (page: number) => currentPage.set(page);

  return { currentPage, totalPages, visibleItems, setPage };
}
