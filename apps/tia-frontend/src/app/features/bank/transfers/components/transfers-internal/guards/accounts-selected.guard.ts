import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TransferStore } from '../../../store/transfers.store';

export const internalAccountsSelectedGuard: CanActivateFn = () => {
  const transferStore = inject(TransferStore);
  const router = inject(Router);

  const hasSender = !!transferStore.senderAccount();
  const hasRecipient = !!transferStore.receiverOwnAccount();

  if (hasSender && hasRecipient) {
    return true;
  }

  return router.parseUrl('/bank/transfers/internal');
};
