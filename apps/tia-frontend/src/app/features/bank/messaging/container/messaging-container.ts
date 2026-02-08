import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterModule } from "@angular/router";
import { NavigationItem } from '@tia/shared/lib/navigation/models/nav-bar.model';
import { NavigationBar } from '@tia/shared/lib/navigation/navigation-bar/navigation-bar';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { InboxService } from '@tia/shared/services/messages/inbox.service';
import { Compose } from "../components/compose/compose";
import { MessagingStore } from '../store/messaging.store';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';

@Component({
  selector: 'app-messaging-container',
  imports: [RouterModule, NavigationBar, Compose, ButtonComponent, TranslatePipe],
  templateUrl: './messaging-container.html',
  styleUrl: './messaging-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagingContainer {
  private readonly translate = inject(TranslateService);
  public readonly inboxService = inject(InboxService);
  public readonly isComposeOpen = signal(false);
  private readonly messagingStore = inject(MessagingStore);
  private readonly breakpointService = inject(BreakpointService);

  public readonly isExtraSmall = this.breakpointService.isExtraSmall;
  public readonly isMobile = this.breakpointService.isMobile;
  public readonly isTablet = this.breakpointService.isTablet;
  public readonly isCollapsed = signal(false);

  constructor() {
    this.inboxService.fetchInboxCount();
    this.messagingStore.getDraftTotalCount(0);
    this.messagingStore.getUnreadImportantCount();
    effect(() => {
      const count = this.inboxService.inboxCount();
      this.messageRoutes.update(routes => {
        routes[0] = { ...routes[0], count };
        return [...routes];
      });
    });

    effect(() => {
      const draftCount = this.messagingStore.draftsTotal?.();
      this.messageRoutes.update(routes => {
        routes[2] = { ...routes[2], count: draftCount ?? 0 };
        return [...routes];
      });
    });

    effect(() => {
      const importantCount = this.messagingStore.importantCount?.();
      this.messageRoutes.update(routes => {
        routes[3] = { ...routes[3], count: importantCount ?? 0 };
        return [...routes];
      });
    });
  }

  public readonly messageRoutes = signal<NavigationItem[]>([
    {
      label: this.translate.instant('messaging.routes.inbox'),
      icon: 'images/svg/messaging/inbox.svg',
      route: 'inbox',
      count: 0,
      activeCount: true
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
