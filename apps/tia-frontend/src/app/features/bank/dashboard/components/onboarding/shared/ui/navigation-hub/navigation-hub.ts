import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationHubCard } from './components/navigation-hub-card/navigation-hub-card';
import { NAVIGATION_HUB_ITEMS } from './config/navigation-hub.config';

@Component({
  selector: 'app-navigation-hub',
  imports: [NavigationHubCard],
  templateUrl: './navigation-hub.html',
  styleUrl: './navigation-hub.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationHub {
  protected readonly items = NAVIGATION_HUB_ITEMS;
}
