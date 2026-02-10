import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pill-paging',
  imports: [],
  templateUrl: './pill-paging.html',
  styleUrl: './pill-paging.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PillPaging {
  public readonly total = input.required<number>();
  public readonly currentIndex = input.required<number>();
  public readonly goTo = output<number>();

  protected readonly pageArray = computed(() => Array(this.total()));
}
