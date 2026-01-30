import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { BankHeader } from '../components/bank-header/bank-header';
import { HeaderNotifications } from '../components/header-notifications/header-notifications';
import { Notifications } from '../service/notifications';
import { Observable, tap } from 'rxjs';
import { NotificationsData } from '../models/notification.model';
import { InboxService } from '@tia/shared/services/messages/inbox.service';
import { NotificationsStore } from '../store/notifications.store';
import { selectCurrentAvatarUrl } from '../../../../store/profile-photo/profile-photo.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-bank-header-container',
  imports: [BankHeader, HeaderNotifications],
  templateUrl: './bank-header-container.html',
  styleUrl: './bank-header-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NotificationsStore],
})
export class BankHeaderContainer implements OnInit {
  readonly notificationsStore = inject(NotificationsStore);

  private store = inject(Store);
  public headerNotificationService = inject(Notifications);
  public inboxService = inject(InboxService);

  public hasUnread = this.notificationsStore.hasUnread;
  public anchorEl = signal<ElementRef | undefined>(undefined);
  public isModalOpen = signal<boolean>(false);
  public notificationsItems$!: Observable<NotificationsData>;
  public inboxCount = computed(() => this.inboxService.inboxCount());
  public avatarUrl = toSignal(this.store.select(selectCurrentAvatarUrl));

  ngOnInit(): void {
    this.notificationsStore.hasUnreadNotifications();

    this.inboxService.fetchInboxCount();
  }

  public onNotificationClick(el: ElementRef): void {
    this.anchorEl.set(el);
    this.notificationsStore.fetchNotifications({
      limit: this.notificationsStore.limitPerPage(),
    });
    this.isModalOpen.update((v) => !v);
  }
}
