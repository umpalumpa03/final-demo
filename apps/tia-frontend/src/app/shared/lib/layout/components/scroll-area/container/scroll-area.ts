import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { TDirection } from './scroll-area.model';

@Component({
  selector: 'app-scroll-area',
  imports: [],
  templateUrl: './scroll-area.html',
  styleUrl: './scroll-area.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollArea {
  public direction = input<TDirection>('vertical');
  public height = input<string>('20rem');

  public readonly isHorizontal = computed(() => this.direction() === 'horizontal');
  public readonly isVertical = computed(() => this.direction() === 'vertical');
}
