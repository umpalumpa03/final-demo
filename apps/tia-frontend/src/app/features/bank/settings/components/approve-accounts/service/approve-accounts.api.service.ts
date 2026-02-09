import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { IAccountsPermissions } from '../../../shared/models/approve-models/accounts-models/account-permissions.models';
import { BankAccount, IUpdateAccountStatus, SuccessResponse } from '../../../shared/models/approve-models/accounts-models/pending-accounts.models';
import { IUpdateAccountPermission } from '../../../shared/models/approve-models/accounts-models/account-permissions.models';


@Injectable({
  providedIn: 'root',
})
export class ApproveAccountsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getAccountPermissions(): Observable<IAccountsPermissions[]> {
    return this.http.get<IAccountsPermissions[]>(
      `${this.apiUrl}/accounts/account-permissions`,
    );
  }

  public getPendingAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(`${this.apiUrl}/accounts/pending`);
  }

  public updateAccountStatus(
    status: IUpdateAccountStatus,
  ): Observable<SuccessResponse> {
    return this.http.put<SuccessResponse>(
      `${this.apiUrl}/accounts/change-account-status`,
      status,
    );
  }

  public modifyAccountPermissions(
    permissions: IUpdateAccountPermission,
  ): Observable<SuccessResponse> {
    return this.http.put<SuccessResponse>(
      `${this.apiUrl}/accounts/modify-account-permission`,
      permissions,
    );
  }
  
}
