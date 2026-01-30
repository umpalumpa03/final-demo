import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  output,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';

@Component({
  selector: 'app-bank-header',
  imports: [RouterLink, RouterLinkActive, Badges],
  templateUrl: './bank-header.html',
  styleUrl: './bank-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankHeader {
  public bellRef = viewChild<ElementRef>('bell');

  public hasUnread = input<boolean>(false);
  public inboxCount = input<number>(0);
  public avatarUrl = input<string | null | undefined>(null);

  public hasInboxMessages = computed(() => this.inboxCount() > 0);
  public onNotificationClick = output<ElementRef>();

  public onNotification(): void {
    const el = this.bellRef();
    if (el) {
      this.onNotificationClick.emit(el);
    }
  }
}
