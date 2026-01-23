import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Pagination } from '@tia/shared/lib/navigation/pagination/pagination';

@Component({
  selector: 'app-pagination-component',
  imports: [Pagination],
  templateUrl: './pagination-component.html',
  styleUrl: './pagination-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  public readonly defaultCurrentPage = signal(1);
  public readonly defaultTotalPages = signal(3);
  public readonly ellipsisCurrentPage = signal(10);
  public readonly ellipsisTotalPages = signal(20);


  // ეს არის მონაცემები pagination-ისთვის 
  public readonly allItems = signal(
    Array.from({ length: 200 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`
    }))
  );

  // დეფოლტ პაგინაციისას შესაბამისი გვერდის დატა რომ წამოიღოთ
  public readonly currentItems = signal(this.allItems().slice(0, 10));
  public ellipsisItems = signal(this.allItems().slice(90, 100));

  public onDefaultPageChange(page: number): void {
    this.defaultCurrentPage.set(page);
    const start = (page - 1) * 10;
    this.currentItems.set(this.allItems().slice(start, start + 10));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public onEllipsisPageChange(page: number): void {
    this.ellipsisCurrentPage.set(page);
    const start = (page - 1) * 10;
    this.ellipsisItems.set(this.allItems().slice(start, start + 10));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
