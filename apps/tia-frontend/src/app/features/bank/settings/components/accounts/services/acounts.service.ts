import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IAccounts,
  IFavoriteRequest,
  IFriendlyNameRequest,
  IVisibilityRequest,
} from '../models/account.models';
import { environment } from 'apps/tia-frontend/src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/settings`;

  public getAllAcounts(): Observable<IAccounts[]> {
    return this.http.get<IAccounts[]>(`${this.baseUrl}/accounts`);
  }

  public markAccountFavoriteStatus(
    body: IFavoriteRequest,
  ): Observable<IAccounts[]> {
    return this.http.put<IAccounts[]>(
      `${this.baseUrl}/account-visibility`,
      body,
    );
  }

  public updateAccountVisibility(
    body: IVisibilityRequest,
  ): Observable<IAccounts[]> {
    return this.http.put<IAccounts[]>(`${this.baseUrl}/favorite`, body);
  }

  public updateAccountFriendlyName(
    body: IFriendlyNameRequest,
  ): Observable<IAccounts[]> {
    return this.http.put<IAccounts[]>(
      `${this.baseUrl}/change-friendly-name`,
      body,
    );
  }
}
