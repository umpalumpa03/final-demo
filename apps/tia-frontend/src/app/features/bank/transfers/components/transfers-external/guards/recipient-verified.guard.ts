import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TransferStore } from '../../../store/transfers.store';

export const recipientVerifiedGuard: CanActivateFn = () => {
  const transferStore = inject(TransferStore);
  const router = inject(Router);

  const hasRecipientInfo = transferStore.recipientInfo();
  const isExternalIban =
    transferStore.recipientType() === 'iban-different-bank' &&
    transferStore.recipientInput();

  if (hasRecipientInfo || isExternalIban) {
    return true;
  }

  router.navigate(['/bank/transfers/external/recipient']);
  return false;
};
