import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Pagination } from '@tia/shared/lib/navigation/pagination/pagination';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pagination-component',
  imports: [Pagination, TranslatePipe],
  templateUrl: './pagination-component.html',
  styleUrl: './pagination-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  public translate = inject(TranslateService);
  public readonly defaultCurrentPage = signal<number>(1);
  public readonly defaultTotalPages = signal<number>(3);
  public readonly ellipsisCurrentPage = signal<number>(10);
  public readonly ellipsisTotalPages = signal<number>(20);

  // ეს არის მონაცემები pagination-ისთვის
  public readonly allItems = signal(
    Array.from({ length: 200 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
    })),
  );

  // დეფოლტ პაგინაციისას შესაბამისი გვერდის დატა რომ წამოიღოთ
  public readonly currentItems = signal(this.allItems().slice(0, 10));
  public readonly ellipsisItems = signal(this.allItems().slice(90, 100));

  public onDefaultPageChange(page: number): void {
    this.defaultCurrentPage.set(page);
    const start = (page - 1) * 10;
    this.currentItems.set(this.allItems().slice(start, start + 10));
  }

  public onEllipsisPageChange(page: number): void {
    this.ellipsisCurrentPage.set(page);
    const start = (page - 1) * 10;
    this.ellipsisItems.set(this.allItems().slice(start, start + 10));
  }
}
