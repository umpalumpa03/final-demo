import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TransferStore } from '../store/transfers.store';

export const accountsSelectedGuard: CanActivateFn = () => {
  const transferStore = inject(TransferStore);
  const router = inject(Router);

  const hasSender = !!transferStore.senderAccount();
  const hasRecipient = !!transferStore.selectedRecipientAccount();
  const isExternal = transferStore.recipientType() === 'iban-different-bank';
  const hasName = !!transferStore.manualRecipientName()?.trim();

  const canProceed =
    hasSender && (isExternal ? hasRecipient || hasName : hasRecipient);

  if (canProceed) {
    return true;
  }

  return router.parseUrl('/bank/transfers/external/accounts');
};
