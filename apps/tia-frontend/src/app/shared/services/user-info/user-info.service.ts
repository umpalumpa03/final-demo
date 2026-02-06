import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUserInfo, User } from '@tia/shared/models/user-info/user-info.models';
import { environment } from '../../../../environments/environment';
import { EMPTY, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserInfoService {
  private baseUrl = `${environment.apiUrl}/users`;
  public readonly http = inject(HttpClient);

  public getUserInfo(): Observable<IUserInfo> {
    return this.http.get<IUserInfo>(`${this.baseUrl}/current-user`);
  }

  public searchByEmail(query: string): Observable<User[]> {
    const params = { email: query };
    return this.http.get<User[]>(`${this.baseUrl}/search-by-email`, {
      params,
    });
  }
}
