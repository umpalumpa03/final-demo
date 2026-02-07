import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IAccounts,
  IFavoriteRequest,
  IFriendlyNameRequest,
  IUpdateResponses,
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
  ): Observable<IUpdateResponses> {
    return this.http.put<IUpdateResponses>(`${this.baseUrl}/favorite`, body);
  }

  public updateAccountVisibility(
    body: IVisibilityRequest,
  ): Observable<IUpdateResponses> {
    return this.http.put<IUpdateResponses>(
      `${this.baseUrl}/account-visibility`,
      body,
    );
  }

  public updateAccountFriendlyName(
    body: IFriendlyNameRequest,
  ): Observable<IUpdateResponses> {
    return this.http.put<IUpdateResponses>(
      `${this.baseUrl}/change-friendly-name`,
      body,
    );
  }
}
