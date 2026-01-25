import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FlexLayoutVariant } from './flex-layout.model';

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
}
