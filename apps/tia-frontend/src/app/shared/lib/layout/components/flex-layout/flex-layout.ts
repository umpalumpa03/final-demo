import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { FlexDirection, FlexLayoutVariant } from './flex-layout.model';

@Component({
  selector: 'app-flex-layout',
  imports: [],
  templateUrl: './flex-layout.html',
  styleUrl: './flex-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexLayout {
  public variant = input<FlexLayoutVariant>();
  public gap = input<string>();
  public wrap = input<boolean>(false);
  public border = input<boolean>(false);
  public direction = input<FlexDirection>('row');

  public isRow = computed(() => this.direction() === 'row');
  public isColumn = computed(() => this.direction() === 'column');
}
