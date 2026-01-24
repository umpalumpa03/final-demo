import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ELLIPSIS, PAGINATION_DEFAULT_CONFIG, PaginationConfig } from '../models/pagination.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  public readonly ELLIPSIS = ELLIPSIS;
  public readonly currentPage = input.required<number>();
  public readonly totalPages = input.required<number>();
  public readonly config = input<PaginationConfig>(PAGINATION_DEFAULT_CONFIG);

  public readonly pageChange = output<number>();

  public readonly visiblePages = computed<(number | string)[]>(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const { showEllipsis = true, maxVisiblePages } = this.config();
    const maxVisible = maxVisiblePages ?? PAGINATION_DEFAULT_CONFIG.maxVisiblePages!;

    if (!showEllipsis || total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisible / 2);

    pages.push(1);

    let start = Math.max(2, current - halfVisible);
    let end = Math.min(total - 1, current + halfVisible);

    if (current <= halfVisible + 1) {
      end = Math.min(maxVisible - 1, total - 1);
    }

    if (current >= total - halfVisible) {
      start = Math.max(2, total - maxVisible + 2);
    }

    if (start > 2) {
      pages.push(ELLIPSIS);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < total - 1) {
      pages.push(ELLIPSIS);
    }

    if (total > 1) {
      pages.push(total);
    }

    return pages;
  });

  public onPageChange(page: number | string): void {
    if (typeof page !== 'number') return;
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }
}
