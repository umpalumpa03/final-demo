import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterModule } from "@angular/router";
import { NavigationItem } from '@tia/shared/lib/navigation/models/nav-bar.model';
import { NavigationBar } from '@tia/shared/lib/navigation/navigation-bar/navigation-bar';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { InboxService } from '@tia/shared/services/messages/inbox.service';
import { Compose } from "../components/compose/compose";
import { MessagingStore } from '../store/messaging.store';
import { DismissibleAlerts } from '@tia/shared/lib/alerts/components/dismissible-alerts/dismissible-alerts';

@Component({
  selector: 'app-messaging-container',
  imports: [RouterModule, NavigationBar, Compose, ButtonComponent, TranslatePipe, DismissibleAlerts],
  templateUrl: './messaging-container.html',
  styleUrl: './messaging-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagingContainer {
  private translate = inject(TranslateService);
  public inboxService = inject(InboxService);
  public isComposeOpen = signal(false);
  private messagingStore = inject(MessagingStore);
  public error = this.messagingStore.error;
  public successMessage = this.messagingStore.successMessage;

  constructor() {
    this.inboxService.fetchInboxCount();
    effect(() => {
      const count = this.inboxService.inboxCount();
      this.messageRoutes.update(routes => {
        routes[0] = { ...routes[0], count };
        return [...routes];
      });
    });

    effect(() => {
      const message = this.successMessage?.();
      const error = this.error?.();
      if (message) {
        setTimeout(() => {
          this.messagingStore.clearSuccessMessage();
        }, 4000);
      }
      if (error) {
        setTimeout(() => {
          this.messagingStore.clearError();
        }, 4000);
      }
    });
  }

  public readonly messageRoutes = signal<NavigationItem[]>([
    {
      label: this.translate.instant('messaging.routes.inbox'),
      icon: 'images/svg/messaging/inbox.svg',
      route: 'inbox',
      count: 0
    },
    {
      label: this.translate.instant('messaging.routes.sent'),
      icon: 'images/svg/messaging/sent.svg',
      route: 'sent',
      count: 0
    },
    {
      label: this.translate.instant('messaging.routes.drafts'),
      icon: 'images/svg/messaging/drafts.svg',
      route: 'draft',
      count: 0
    },
    {
      label: this.translate.instant('messaging.routes.important'),
      icon: 'images/svg/messaging/important.svg',
      route: 'important',
      count: 0
    },
    {
      label: this.translate.instant('messaging.routes.favorites'),
      icon: 'images/svg/messaging/favorites.svg',
      route: 'favorites',
      count: 0
    }
  ]
  )
}
