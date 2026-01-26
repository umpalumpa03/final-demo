import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BankHeader } from '../components/bank-header/bank-header';

@Component({
  selector: 'app-bank-header-container',
  imports: [BankHeader],
  templateUrl: './bank-header-container.html',
  styleUrl: './bank-header-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankHeaderContainer {
  public hasUnread = signal(true);

  public onNotificationClick(): void {
    console.log('loading mod');
  }
}
