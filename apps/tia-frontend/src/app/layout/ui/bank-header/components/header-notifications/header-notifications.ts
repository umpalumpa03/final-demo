import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  signal,
} from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsData } from '../../modals/notification-modal';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header-notifications',
  imports: [AsyncPipe],
  templateUrl: './header-notifications.html',
  styleUrl: './header-notifications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNotifications {
  public isOpen = input<boolean>();
  public messages = input();
  public anchor = input<ElementRef | undefined>();
  public notificationsItems = input<Observable<NotificationsData>>();

  public top = signal(0);
  public left = signal(0);

  constructor() {
    effect(() => {
      const anchorEl = this.anchor();
      const open = this.isOpen();

      if (!anchorEl || !open) return;

      const rect = anchorEl.nativeElement.getBoundingClientRect();

      this.top.set(rect.bottom + window.scrollY);
      this.left.set(rect.right - 380);
    });
  }
}
