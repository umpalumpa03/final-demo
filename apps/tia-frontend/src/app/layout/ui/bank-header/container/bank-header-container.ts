import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { BankHeader } from '../components/bank-header/bank-header';
import { HeaderNotifications } from '../components/header-notifications/header-notifications';
import { Notifications } from '../service/notifications';
import { Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { NotificationsData } from '../modals/notification.model';

@Component({
  selector: 'app-bank-header-container',
  imports: [BankHeader, HeaderNotifications],
  templateUrl: './bank-header-container.html',
  styleUrl: './bank-header-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankHeaderContainer implements OnInit, OnDestroy {
  // Service Injection
  public headerNotificationService = inject(Notifications);

  // public hasUnread = input<boolean>(true);
  public hasUnread = signal<boolean>(false);
  public anchorEl = signal<ElementRef | undefined>(undefined);
  public isModalOpen = signal<boolean>(false);
  public notificationsItems$!: Observable<NotificationsData>;

  public destroyRef$ = new Subject<null>();

  ngOnInit(): void {


    this.headerNotificationService
      .hasUnreadNotification()
      .pipe(
        takeUntil(this.destroyRef$),
        tap((value) => {
          this.hasUnread.set(value.hasUnread);
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

  ngOnDestroy(): void {
    this.destroyRef$.next(null);
    this.destroyRef$.complete();
  }
}
