import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TransferStore } from '../../../store/transfers.store';

export const fromAccountSelectedGuard: CanActivateFn = () => {
  const transferStore = inject(TransferStore);
  const router = inject(Router);

  const hasSender = !!transferStore.senderAccount();

  if (hasSender) {
    return true;
  }

  return router.parseUrl('/bank/transfers/internal/from-account');
};

