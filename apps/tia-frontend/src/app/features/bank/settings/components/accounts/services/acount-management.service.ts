import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
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

  public getAllAccounts(): Observable<IAccounts[]> {
    return this.http.get<IAccounts[]>(`${this.baseUrl}/accounts`);
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

  public toggleFavorite(
    id: string,
    isFavorite: boolean | null,
  ): Observable<IAccounts[]> {
    return this.markAccountFavoriteStatus({
      accountId: id,
      isFavorite: !isFavorite,
    });
  }

  public toggleVisibility(
    id: string,
    isHidden: boolean | null,
  ): Observable<IAccounts[]> {
    const nextHidden = !(isHidden ?? false);

    const removeFavoriteIfHidden$ = nextHidden
      ? this.markAccountFavoriteStatus({
          accountId: id,
          isFavorite: false,
        }).pipe(
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
        });

    return removeFavoriteIfHidden$;
  }
}
