import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bank-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bank-header.html',
  styleUrl: './bank-header.scss',
})
export class BankHeader {
  public hasUnread = input(false);

  public onNotificationClick = output();
  public onNotification(): void {
    this.onNotificationClick.emit();
  }
}
