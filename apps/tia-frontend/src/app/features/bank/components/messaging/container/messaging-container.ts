import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from "@angular/router";
import { MESSAGINGROUTES } from '../config/routes.config';
import { NavigationItem } from '@tia/shared/lib/navigation/models/nav-bar.model';
import { NavigationBar } from '@tia/shared/lib/navigation/navigation-bar/navigation-bar';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-messaging-container',
  imports: [RouterModule, NavigationBar, ButtonComponent],
  templateUrl: './messaging-container.html',
  styleUrl: './messaging-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagingContainer {
  public readonly messagingRoutes = signal<NavigationItem[]>(MESSAGINGROUTES);

}
