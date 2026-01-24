import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KeyValueDisplayBadgeTone, KeyValueDisplayItem } from './models/models';

@Component({
  selector: 'app-key-value-display',
  imports: [],
  templateUrl: './key-value-display.html',
  styleUrl: './key-value-display.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueDisplay {
  public readonly title = input('');
  public readonly items = input<KeyValueDisplayItem[]>([]);

  public badgeClass(tone?: KeyValueDisplayBadgeTone): string {
    const baseClass = 'key-value-display__badge';
    if (!tone) {
      return baseClass;
    }
    return `${baseClass} ${baseClass}--${tone}`;
  }
}
