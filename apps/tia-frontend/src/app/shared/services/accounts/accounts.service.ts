import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Account,
  AccountsResponse,
  CreateAccountRequest,
} from '../../models/accounts/accounts.model';

@Injectable(
  {
    providedIn: 'root',
  }
)
export class AccountsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/accounts`;

  public getAccounts(): Observable<AccountsResponse> {
    return this.http.get<AccountsResponse>(this.apiUrl);
  }

  public getAccountById(accountId: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${accountId}`);
  }

  public createAccount(request: CreateAccountRequest): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, request);
  }

  public makeTransfer(accountId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${accountId}/transfer`, {});
  }

  public getCurrencies(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/catalogs/currencies`);
  }
}
