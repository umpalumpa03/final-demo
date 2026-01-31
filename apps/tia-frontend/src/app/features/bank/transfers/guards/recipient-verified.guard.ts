import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TransferStore } from '../store/transfers.store';

export const recipientVerifiedGuard: CanActivateFn = () => {
  const transferStore = inject(TransferStore);
  const router = inject(Router);

  if (transferStore.recipientInfo()) {
    return true;
  }

  router.navigate(['/bank/transfers/external/recipient']);
  return false;
};
