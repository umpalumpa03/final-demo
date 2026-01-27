import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NavigationBar } from '@tia/shared/lib/navigation/navigation-bar/navigation-bar';
import { VERTICALNAVBARS } from '../../config/tabs-data';
import { NavigationItem } from '@tia/shared/lib/navigation/models/nav-bar.model';

@Component({
  selector: 'app-nav-bar',
  imports: [NavigationBar],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBar {
  public readonly verticalItems = signal<NavigationItem[]>(VERTICALNAVBARS);
}
