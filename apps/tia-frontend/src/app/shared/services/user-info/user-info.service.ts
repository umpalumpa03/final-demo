import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUserInfo, User } from '@tia/shared/models/user-info/user-info.models';
import { environment } from '../../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

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

  public updateOnboardingStatus(
    completed: boolean,
  ): Observable<{ success: boolean }> {
    const body = { hasCompletedOnboarding: completed };

    return this.http
      .put<{ success: boolean }>(`${this.baseUrl}/onboarding-status`, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage =
            'An error occurred while updating onboarding status.';

          if (error.status === 401) {
            errorMessage = 'Unauthorized: Please sign in again.';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }

          return throwError(() => errorMessage);
        }),
      );
  }
}
