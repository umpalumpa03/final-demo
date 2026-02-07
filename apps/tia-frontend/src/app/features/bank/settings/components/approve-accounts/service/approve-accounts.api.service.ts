import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'apps/tia-frontend/src/environments/environment';
import { Observable } from 'rxjs';
import { IAccountsPermissions } from '../models/account-permissions.models';

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
}
