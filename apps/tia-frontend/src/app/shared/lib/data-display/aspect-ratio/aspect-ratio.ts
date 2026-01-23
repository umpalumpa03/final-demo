import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AspectRatioItem } from './models/aspect-ratio.models';

@Component({
  selector: 'app-aspect-ratio-list',
  imports: [],
  templateUrl: './aspect-ratio.html',
  styleUrl: './aspect-ratio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AspectRatio {
  public items = input<AspectRatioItem[]>([]);
  public selected = output<AspectRatioItem>();

  public onSelect(item: AspectRatioItem): void {
    this.selected.emit(item);
  }
}
