import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  Account,
  AccountsResponse,
  CreateAccountRequest,
} from '../../models/accounts/accounts.model';
import { AccountsStore } from '../../../features/bank/settings/components/accounts/strore/accounts.store';

@Injectable({ providedIn: 'root' })
export class AccountsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/accounts`;
  private readonly store = inject(AccountsStore);

  public getAccounts(): Observable<AccountsResponse> {
    return this.http.get<AccountsResponse>(this.apiUrl, {
      params: {
        ignoreHiddens: 'true',
        status: 'active',
      },
    });
  }

  public getActiveAccounts(): Observable<AccountsResponse> {
    return this.http.get<AccountsResponse>(this.apiUrl, {
      params: {
        ignoreHiddens: 'false',
        status: 'active',
      },
    });
  }

  public getAccountById(accountId: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${accountId}`);
  }

  public createAccount(request: CreateAccountRequest): Observable<Account> {
    return this.http.post<Account>(
      `${this.apiUrl}/create-account-request`,
      request,
    );
  }

  public makeTransfer(accountId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${accountId}/transfer`, {});
  }

  public getCurrencies(): Observable<string[]> {
    return this.http
      .get<
        Array<{ value: string; label: string }>
      >(`${this.apiUrl}/catalogs/currencies`)
      .pipe(
        map((currencies) => currencies.map((c) => c.value)),
        startWith([]),
      );
  }

  public updateFriendlyName(
    accountId: string,
    friendlyName: string,
  ): Observable<Account> {
    return this.http
      .put<Account>(`${this.apiUrl}/update-friendly-name/${accountId}`, {
        friendlyName,
      })
      .pipe(
        tap(() => {
          this.store.resetStore();
        }),
      );
  }
}
