import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PERMISSION_ROUTE_MAP } from '../config/accounts.config';

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  private readonly router = inject(Router);

  public navigateToTransferPage(
    accountId: string,
    permissionValue: number,
  ): boolean {
    const route = PERMISSION_ROUTE_MAP[permissionValue];
    if (route) {
      this.router.navigate([route], {
        queryParams: { accountId },
      });
      return true;
    }
    return false;
  }
}
