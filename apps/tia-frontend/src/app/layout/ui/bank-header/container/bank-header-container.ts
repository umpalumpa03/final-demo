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
import { NotificationsData } from '../modals/notification.model';
import { InboxService } from '@tia/shared/services/messages/inbox.service';
import { selectCurrentAvatarUrl } from '../../../../store/profile-photo/profile-photo.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-bank-header-container',
  imports: [BankHeader, HeaderNotifications],
  templateUrl: './bank-header-container.html',
  styleUrl: './bank-header-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankHeaderContainer implements OnInit {
  private store = inject(Store);
  public headerNotificationService = inject(Notifications);
  public inboxService = inject(InboxService);

  public hasUnread = signal<boolean>(false);
  public anchorEl = signal<ElementRef | undefined>(undefined);
  public isModalOpen = signal<boolean>(false);
  public notificationsItems$!: Observable<NotificationsData>;
  public inboxCount = computed(() => this.inboxService.inboxCount());
  public avatarUrl = toSignal(this.store.select(selectCurrentAvatarUrl));

  ngOnInit(): void {
    this.headerNotificationService
      .hasUnreadNotification()
      .pipe(
        tap((value) => {
          this.hasUnread.set(value.hasUnread);
        }),
      )
      .subscribe();

      this.inboxService.fetchInboxCount();
  }

  public onNotificationClick(el: ElementRef): void {
    this.anchorEl.set(el);
    this.notificationsItems$ = this.headerNotificationService
      .getNotifications()
      .pipe(tap((data) => console.log(data)));
    this.isModalOpen.update((v) => !v);
  }
}
