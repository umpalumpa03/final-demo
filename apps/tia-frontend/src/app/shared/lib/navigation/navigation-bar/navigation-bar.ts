import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationItem, NavigationOrientation } from '../models/nav-bar.model';

@Component({
  selector: 'app-navigation-bar',
  imports: [RouterModule],
  templateUrl: './navigation-bar.html',
  styleUrl: './navigation-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBar {
  public readonly items = input.required<NavigationItem[]>();
  public readonly orientation = input<NavigationOrientation>('horizontal');
  public readonly activeItem = input<string>();
  public readonly collapsed = input<boolean>(false);
  public readonly customPadding = input<string>('0');
  public readonly routeWithActive = computed(() => {
    return this.items().map((item) => ({
      ...item,
      isActive: this.activeItem() === item.label,
    }));
  });
}
