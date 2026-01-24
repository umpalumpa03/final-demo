import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FlexVariant } from '../config/flex-layout.config';

@Component({
  selector: 'app-flex-layout',
  imports: [],
  templateUrl: './flex-layout.html',
  styleUrl: './flex-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexLayout {
  public variant = input<FlexVariant>();
  public gap = input<string>();
  public wrap = input<boolean>(false);
}
