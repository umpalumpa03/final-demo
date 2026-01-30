import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TranslatePipe } from '@ngx-translate/core';
import { TransferStore } from '../../../../store/transfers.store';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { VerifiedUserCard } from '../../../../ui/verified-user-card/verified-user-card';
import { TransfersAccountCard } from '../../../../ui/account-card/transfers-account-card';
import { RecipientAccount } from '../../../../models/transfers.state.model';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';

@Component({
  selector: 'app-external-accounts',
  standalone: true,
  imports: [
    ButtonComponent,
    TranslatePipe,
    AlertTypesWithIcons,
    VerifiedUserCard,
    TransfersAccountCard,
    ErrorStates,
    Spinner,
  ],
  templateUrl: './external-accounts.html',
  styleUrl: './external-accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalAccounts {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly transferStore = inject(TransferStore);

  public readonly showSuccess = signal(false);
  public readonly selectedAccountId = signal<string | null>(null);

  public readonly isLoading = computed(() => this.transferStore.isLoading());
  public readonly error = computed(() => this.transferStore.error());

  public readonly recipientName = computed(
    () => this.transferStore.recipientInfo()?.fullName || '',
  );

  public readonly recipientAccounts = computed(
    () => this.transferStore.recipientInfo()?.accounts || [],
  );

  constructor() {
    effect(() => {
      const recipientInfo = this.transferStore.recipientInfo();
      if (recipientInfo) {
        this.showSuccess.set(true);
        const timeout = setTimeout(() => {
          this.showSuccess.set(false);
        }, 3000);

        return () => clearTimeout(timeout);
      }
      return;
    });
  }

  public onRecieverAccountSelect(account: Account | RecipientAccount): void {
    this.selectedAccountId.set(account.id);
  }

  public onRetry(): void {}

  public onGoBack(): void {
    this.location.back();
  }

  public onContinue(): void {
    if (this.selectedAccountId()) {
      this.router.navigate(['/bank/transfers/external/amount']);
    }
  }
}
