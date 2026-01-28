import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { BankHeader } from '../components/bank-header/bank-header';
import { HeaderNotifications } from '../components/header-notifications/header-notifications';
import { Notifications } from '../service/notifications';
import { Observable, tap } from 'rxjs';
import { NotificationsData } from '../modals/notification.model';
import { InboxService } from '@tia/shared/services/messages/inbox.service';

@Component({
  selector: 'app-bank-header-container',
  imports: [BankHeader, HeaderNotifications],
  templateUrl: './bank-header-container.html',
  styleUrl: './bank-header-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankHeaderContainer implements OnInit {
  public headerNotificationService = inject(Notifications);
  public inboxService = inject(InboxService);

  public hasUnread = signal<boolean>(false);
  public anchorEl = signal<ElementRef | undefined>(undefined);
  public isModalOpen = signal<boolean>(false);
  public notificationsItems$!: Observable<NotificationsData>;
  public inboxCount = signal<number>(0);

  ngOnInit(): void {
    this.headerNotificationService
      .hasUnreadNotification()
      .pipe(
        tap((value) => {
          this.hasUnread.set(value.hasUnread);
        }),
      )
      .subscribe();

    this.inboxService
      .getInboxCount()
      .pipe(
        tap((value) => {
          this.inboxCount.set(value.count);
        }),
      )
      .subscribe();
  }

  public onNotificationClick(el: ElementRef): void {
    this.anchorEl.set(el);
    this.notificationsItems$ = this.headerNotificationService
      .getNotifications()
      .pipe(tap((data) => console.log(data)));
    this.isModalOpen.update((v) => !v);
  }
}
