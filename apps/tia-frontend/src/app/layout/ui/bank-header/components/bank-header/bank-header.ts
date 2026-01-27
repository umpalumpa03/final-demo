import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bank-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bank-header.html',
  styleUrl: './bank-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankHeader {
  public bellRef = viewChild<ElementRef>('bell');

  public hasUnread = input<boolean>(false);

  public onNotificationClick = output<ElementRef>();

  public onNotification(): void {
    const el = this.bellRef();
    if (el) {
      this.onNotificationClick.emit(el);
    }
  }
}
