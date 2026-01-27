import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { FlexDirection, FlexLayoutVariant } from './flex-layout.model';

@Component({
  selector: 'app-flex-layout',
  imports: [],
  templateUrl: './flex-layout.html',
  styleUrl: './flex-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexLayout {
  public readonly variant = input<FlexLayoutVariant>();
  public readonly gap = input<string>();
  public readonly wrap = input<boolean>(false);
  public readonly border = input<boolean>(false);
  public readonly direction = input<FlexDirection>('row');

  public readonly layoutClasses = computed(() => {
    const classes = ['flex-layout', 'ta-flex-layout'];

    if (this.variant() === 'space-between')
      classes.push('flex-layout--space-between');
    if (this.variant() === 'center') classes.push('flex-layout--center');
    if (this.wrap()) classes.push('flex-layout--wrap');
    if (this.border()) classes.push('flex-layout--border');
    if (this.direction() === 'row') classes.push('direction-row');
    if (this.direction() === 'column') classes.push('direction-column');

    return classes.join(' ');
  });
}
