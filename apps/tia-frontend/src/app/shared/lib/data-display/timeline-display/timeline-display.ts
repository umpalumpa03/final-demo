import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  TimelineDisplayItem,
  TimelineDisplayTone,
} from '../models/timeline-display.models';

@Component({
  selector: 'app-timeline-display',
  imports: [],
  templateUrl: './timeline-display.html',
  styleUrl: './timeline-display.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineDisplay {
  public readonly items = input<TimelineDisplayItem[]>([]);

  public readonly displayItems = computed(() => {
    const items = this.items();
    return items.map((item, index) => ({
      ...item,
      dotClass: this.dotClass(item.tone),
      isLast: index === items.length - 1,
    }));
  });

  private dotClass(tone?: TimelineDisplayTone): string {
    const baseClass = 'timeline-display__dot';
    if (!tone) {
      return baseClass;
    }
    return `${baseClass} ${baseClass}--${tone}`;
  }
}
