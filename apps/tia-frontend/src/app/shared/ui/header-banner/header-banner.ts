import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-header-banner',
  imports: [],
  templateUrl: './header-banner.html',
  styleUrl: './header-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderBanner {
  public readonly imagePath = input.required<string>();
}
