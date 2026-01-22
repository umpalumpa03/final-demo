import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { AspectRatio } from '../../../../../../shared/lib/data-display/aspect-ratio/aspect-ratio';
import { AspectRatioItem } from '../../../../../../shared/lib/data-display/aspect-ratio/models/aspect-ratio.models';
import { ASPECT_RATIO_ITEMS } from './config/aspect-ratio.data';

@Component({
  selector: 'app-aspect-ratio',
  imports: [LibraryTitle, AspectRatio],
  templateUrl: './aspect-ratio.html',
  styleUrl: './aspect-ratio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AspectRatioComponent {
  public readonly title = 'Aspect Ratio';
  public readonly ratios = signal(ASPECT_RATIO_ITEMS);
  public readonly selectedRatio = signal<AspectRatioItem | null>(null);

  public onRatioSelected(item: AspectRatioItem): void {
    this.selectedRatio.set(item);
  }

   public hasRatios(): boolean {
    if (this.ratios().length === 0) {
      return false;
    }
    return true;
  }
  
}
