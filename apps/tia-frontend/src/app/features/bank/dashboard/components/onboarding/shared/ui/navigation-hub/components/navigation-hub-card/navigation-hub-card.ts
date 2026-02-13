import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NavigationHubItem } from '../../models/navigation-hub.model';

@Component({
  selector: 'app-navigation-hub-card',
  templateUrl: './navigation-hub-card.html',
  styleUrl: './navigation-hub-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationHubCard {
  public readonly item = input.required<NavigationHubItem>();
}
