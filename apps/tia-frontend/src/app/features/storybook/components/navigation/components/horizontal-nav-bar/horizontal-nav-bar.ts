import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NavigationBar } from '@tia/shared/lib/navigation/navigation-bar/navigation-bar';
import { HORIZONTALNAVBARS } from '../../config/tabs-data';
import { NavigationItem } from '@tia/shared/lib/navigation/models/nav-bar.model';

@Component({
  selector: 'app-horizontal-nav-bar',
  imports: [NavigationBar],
  templateUrl: './horizontal-nav-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalNavBar {
  public readonly activeHorizontal = signal<string>('Dashboard');
  public readonly horizontalItems = signal<NavigationItem[]>(HORIZONTALNAVBARS);
}
