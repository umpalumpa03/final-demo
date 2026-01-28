import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountCardComponent } from '../account-card/container/account-card';
import { ButtonComponent } from '../../../../../../../shared/lib/primitives/button/button';
import { RouteLoader } from '../../../../../../../shared/lib/feedback/route-loader/route-loader';
import {
  AccountSection,
  GroupedAccounts,
} from '../../../../models/accounts.model';
import { ErrorStates } from '../../../../../../../shared/lib/feedback/error-states/error-states';

@Component({
  selector: 'app-accounts-list',
  imports: [
    CommonModule,
    AccountCardComponent,
    ButtonComponent,
    RouteLoader,
    ErrorStates,
  ],
  templateUrl: './accounts-list.html',
  styleUrl: './accounts-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsListComponent {
  public accountsGrouped = input.required<GroupedAccounts | null>();
  public isLoading = input.required<boolean>();
  public error = input<string | null>(null);
  public accountSections = input.required<AccountSection[]>();

  public openModal = output<void>();
  public transfer = output<string>();
  public retry = output<void>();

  public handleOpenModal(): void {
    this.openModal.emit();
  }

  public handleTransfer(accountId: string): void {
    this.transfer.emit(accountId);
  }

  public handleRetry(): void {
    this.retry.emit();
  }
}
