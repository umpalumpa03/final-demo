import { inject, Injectable } from '@angular/core';
import { TransferStore } from 'apps/tia-frontend/src/app/features/bank/transfers/store/transfers.store';
import { AccountData } from 'apps/tia-frontend/src/app/features/bank/transfers/models/transfers.state.model';
import { Account } from '@tia/shared/models/accounts/accounts.model';

@Injectable()
export class TransferInternalService {
  private readonly transferStore = inject(TransferStore);

  public handleFromAccountSelect(account: Account, currentSelection: Account | null): void {
    if (currentSelection?.id === account.id) {
      this.transferStore.setSenderAccount(null);
    } else {
      this.transferStore.setSenderAccount(account);
    }
  }

  public handleToAccountSelect(account: Account, currentSelected: Account | null) {
    if (currentSelected?.id === account.id) {
      this.transferStore.setReceiverOwnAccount(null);
    } else {
      this.transferStore.setReceiverOwnAccount(account);
    }
  }
}
