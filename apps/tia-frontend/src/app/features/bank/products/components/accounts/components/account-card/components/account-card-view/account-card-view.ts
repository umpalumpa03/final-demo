import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from '../../../../../../models/accounts.model';
import { ButtonComponent } from '../../../../../../../../../shared/lib/primitives/button/button';
import { BasicCard } from '../../../../../../../../../shared/lib/cards/basic-card/basic-card';

@Component({
  selector: 'app-account-card-view',
  imports: [CommonModule, ButtonComponent, BasicCard],
  templateUrl: './account-card-view.html',
  styleUrl: './account-card-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCardViewComponent {
  public account = input.required<Account>();
  public accountIcon = input.required<string>();
  public formattedBalance = input.required<string>();
  public formattedDate = input.required<string>();

  public transfer = output<void>();

  public handleTransfer(): void {
    this.transfer.emit();
  }
}
