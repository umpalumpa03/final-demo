import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from '../../../../models/account.model';
import { ButtonComponent } from '../../../../../../../shared/lib/primitives/button/button';
import { BasicCard } from '../../../../../../../shared/lib/cards/basic-card/basic-card';

@Component({
  selector: 'app-account-card',
  imports: [CommonModule, ButtonComponent, BasicCard],
  templateUrl: './account-card.html',
  styleUrl: './account-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCardComponent {
  public account = input.required<Account>();
  public transfer = output<string>();

  public handleTransfer(): void {
    this.transfer.emit(this.account().id);
  }

  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  public formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  public getAccountIcon(type: string): string {
    switch (type) {
      case 'current':
        return './images/svg/account/wallet.svg';
      case 'saving':
        return './images/svg/account/piggy-bank.svg';
      case 'card':
        return './images/svg/account/building.svg';
      default:
        return './images/svg/account/wallet.svg';
    }
  }
}
