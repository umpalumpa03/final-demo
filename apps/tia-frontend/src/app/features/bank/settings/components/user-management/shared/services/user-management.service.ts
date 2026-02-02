import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../../../environments/environment';
import { Observable } from 'rxjs';
import {
  IUser,
  IUserDetail,
  IUpdateUserRequest,
  IBlockUserRequest,
} from '../models/users.model';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users/management`;

  public getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl);
  }

  public getUserById(userId: string): Observable<IUserDetail> {
    return this.http.get<IUserDetail>(`${this.apiUrl}/${userId}`);
  }

  public updateUser(
    userId: string,
    payload: IUpdateUserRequest,
  ): Observable<IUserDetail> {
    return this.http.patch<IUserDetail>(`${this.apiUrl}/${userId}`, payload);
  }

  public deleteUser(
    userId: string,
  ): Observable<{ success: true; message: string }> {
    return this.http.delete<{ success: true; message: string }>(
      `${this.apiUrl}/${userId}`,
    );
  }

  public blockUser(
    userId: string,
    isBlocked: boolean,
  ): Observable<IUserDetail> {
    const payload: IBlockUserRequest = { isBlocked };
    return this.http.post<IUserDetail>(
      `${this.apiUrl}/${userId}/block`,
      payload,
    );
  }
}
