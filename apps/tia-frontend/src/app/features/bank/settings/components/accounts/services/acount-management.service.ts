import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  catchError,
  finalize,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import {
  IAccounts,
  IFavoriteRequest,
  IFriendlyNameRequest,
  IVisibilityRequest,
} from '../models/account.models';
import { environment } from 'apps/tia-frontend/src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountManagementService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/settings`;
  public isLoading = signal(false);
  public accountsList = signal<IAccounts[]>([]);
  private refreshCallback?: () => void;

  public setRefreshCallback(callback: () => void): void {
    this.refreshCallback = callback;
  }

  public getAllAcounts(): Observable<IAccounts[]> {
    this.isLoading.set(true);
    return this.http.get<IAccounts[]>(`${this.baseUrl}/accounts`).pipe(
      tap((accounts) => {
        this.accountsList.set(accounts);
      }),
      catchError((err) => {
        this.accountsList.set([]);
        this.isLoading.set(false);
        return throwError(() => err);
      }),
      finalize(() => this.isLoading.set(false)),
    );
  }

  public markAccountFavoriteStatus(
    body: IFavoriteRequest,
  ): Observable<IAccounts[]> {
    return this.http.put<IAccounts[]>(`${this.baseUrl}/favorite`, body);
  }

  public updateAccountVisibility(
    body: IVisibilityRequest,
  ): Observable<IAccounts[]> {
    return this.http.put<IAccounts[]>(
      `${this.baseUrl}/account-visibility`,
      body,
    );
  }

  public updateAccountFriendlyName(
    body: IFriendlyNameRequest,
  ): Observable<IAccounts[]> {
    return this.http.put<IAccounts[]>(
      `${this.baseUrl}/change-friendly-name`,
      body,
    );
  }

  public handleFavoriteStatus(
    id: string,
    isFavorite: boolean | null,
  ): Observable<IAccounts[]> {
    this.isLoading.set(true);
    return this.markAccountFavoriteStatus({
      accountId: id,
      isFavorite: !isFavorite,
    }).pipe(
      tap(() => {
        if (this.refreshCallback) {
          this.refreshCallback();
        }
      }),
      catchError((err) => {
        this.isLoading.set(false);
        return throwError(() => err);
      }),
      finalize(() => this.isLoading.set(false)),
    );
  }

  public handleAccountVisibility(
    id: string,
    isHidden: boolean | null,
  ): Observable<IAccounts[]> {
    this.isLoading.set(true);
    const nextHidden = !(isHidden ?? false);
    const removeFavoriteIfHidden$ = nextHidden
      ? this.markAccountFavoriteStatus({
          accountId: id,
          isFavorite: false,
        })
      : null;

    return (
      removeFavoriteIfHidden$
        ? removeFavoriteIfHidden$.pipe(
            switchMap(() =>
              this.updateAccountVisibility({
                accountId: id,
                isHidden: nextHidden,
              }),
            ),
          )
        : this.updateAccountVisibility({
            accountId: id,
            isHidden: nextHidden,
          })
    ).pipe(
      tap(() => {
        if (this.refreshCallback) {
          this.refreshCallback();
        }
      }),
      catchError((err) => {
        this.isLoading.set(false);
        return throwError(() => err);
      }),
      finalize(() => this.isLoading.set(false)),
    );
  }
}
