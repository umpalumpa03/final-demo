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
import { NotificationsData } from '../modals/notification-modal';

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

  // FOR NOW VALUE, WILL BE DELETED
  public mfaVerification = '';
  public destroyRef$ = new Subject<null>();

  ngOnInit(): void {
    // THIS PART WILL BE DELETED AFTER AUTH INTERCEPTOR
    this.headerNotificationService
      .userSignIn()
      .pipe(
        takeUntil(this.destroyRef$),

        switchMap((value: any) => {
          return this.headerNotificationService.mfaVerification({
            challengeId: value.challengeId,
            code: '1111',
          });
        }),

        tap((value: any) => {
          localStorage.setItem('JWT-Token', value['access_token']);
        }),
      )
      .subscribe();
    // //////////////////

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
