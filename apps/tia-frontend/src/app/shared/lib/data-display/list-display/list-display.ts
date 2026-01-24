import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ListDisplayItem, ListDisplayTone } from './models/models';

@Component({
  selector: 'app-list-display',
  imports: [],
  templateUrl: './list-display.html',
  styleUrl: './list-display.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListDisplay {
  public readonly items = input<ListDisplayItem[]>([]);
  public readonly selectable = input(false);
  public readonly selected = output<ListDisplayItem>();

  public onSelect(item: ListDisplayItem): void {
    if (!this.selectable()) {
      return;
    }
    this.selected.emit(item);
  }

  public badgeClass(tone?: ListDisplayTone): string {
    const baseClass = 'list-display__badge';
    if (!tone) {
      return baseClass;
    }
    return `${baseClass} ${baseClass}--${tone}`;
  }

  public statusClass(tone?: ListDisplayTone): string {
    const baseClass = 'list-display__status';
    if (!tone) {
      return baseClass;
    }
    return `${baseClass} ${baseClass}--${tone}`;
  }
}
