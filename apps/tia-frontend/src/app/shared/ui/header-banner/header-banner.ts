import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-header-banner',
  imports: [],
  templateUrl: './header-banner.html',
  styleUrl: './header-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderBanner {
  public readonly imagePath = input.required<string>();
  protected readonly imgUrl = computed(() => `url('${this.imagePath()}')`);
}
