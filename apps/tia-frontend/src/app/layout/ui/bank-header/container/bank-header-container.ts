import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { BankHeader } from '../components/bank-header/bank-header';
import { Notifications } from '../components/header-notifications/service/notifications';
import { fromEvent, Observable } from 'rxjs';
import { NotificationsData } from '../components/header-notifications/models/notification.model';
import { InboxService } from '@tia/shared/services/messages/inbox.service';
import { NotificationsStore } from '../components/header-notifications/store/notifications.store';
import { selectSavedAvatarUrl } from '../../../../features/bank/settings/components/profile-photo/store/profile-photo/profile-photo.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { NotificationsContainer } from '../components/header-notifications/container/notifications-container';
import {
  selectIsTodayBirthday,
  selectUserFullName,
} from '../../../../store/user-info/user-info.selectors';

@Component({
  selector: 'app-bank-header-container',
  imports: [BankHeader, NotificationsContainer],
  templateUrl: './bank-header-container.html',
  styleUrl: './bank-header-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankHeaderContainer implements OnInit {
  readonly notificationsStore = inject(NotificationsStore);

  private store = inject(Store);
  public headerNotificationService = inject(Notifications);
  public inboxService = inject(InboxService);

  public hasUnread = this.notificationsStore.hasUnread;
  public anchorEl = signal<ElementRef | null>(null);
  public isModalOpen = signal<boolean>(false);
  public notificationsItems$!: Observable<NotificationsData>;
  public inboxCount = computed(() => this.inboxService.inboxCount());
  public avatarUrl = toSignal(this.store.select(selectSavedAvatarUrl));
  public fullName = toSignal(this.store.select(selectUserFullName), {
    initialValue: '',
  });

  readonly notificationsContainerRef = viewChild(NotificationsContainer, {
    read: ElementRef,
  });
  public hasBirthday = this.store.selectSignal(selectIsTodayBirthday);

  private readonly documentClick = toSignal(
    fromEvent<MouseEvent>(document, 'click'),
  );

  constructor() {
    effect(() => {
      const event = this.documentClick();
      if (!event || !this.isModalOpen()) return;

      const target = event.target as HTMLElement;
      const anchorEl = this.anchorEl();
      const containerEl = this.notificationsContainerRef();

      const isAnchorClick = anchorEl?.nativeElement.contains(target) ?? false;
      const isContainerClick = containerEl?.nativeElement.contains(target);

      if (anchorEl && !isAnchorClick && !isContainerClick) {
        this.closeAndReset();
      }
    });
  }

  ngOnInit(): void {
    this.notificationsStore.hasUnreadNotifications();
    this.inboxService.fetchInboxCount();
  }

  public onNotificationClick(el: ElementRef | null): void {
    this.anchorEl.set(el);

    if (this.isModalOpen()) {
      this.closeAndReset();
      return;
    }

    this.notificationsStore.fetchNotifications({
      limit: this.notificationsStore.limitPerPage(),
    });

    this.isModalOpen.update((v) => !v);
  }

  public closeAndReset(): void {
    this.isModalOpen.set(false);
  }
}
