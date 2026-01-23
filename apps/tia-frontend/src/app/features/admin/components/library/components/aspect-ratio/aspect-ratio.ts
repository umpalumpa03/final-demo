import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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
  public readonly selectedRatioId = signal<string | null>(null);
  public readonly selectedRatio = computed<AspectRatioItem | null>(() => {
    const selectedId = this.selectedRatioId();
    if (!selectedId) {
      return null;
    }
    return this.ratios().find((item) => item.id === selectedId) ?? null;
  });

  public onRatioSelected(item: AspectRatioItem): void {
    this.selectedRatioId.set(item.id);
  }

  public hasRatios(): boolean {
    return this.ratios().length > 0;
  }
  
}
