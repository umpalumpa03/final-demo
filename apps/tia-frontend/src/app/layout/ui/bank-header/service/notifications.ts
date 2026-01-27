import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HasUnreadNotifications,
  NotificationsData,
} from '../modals/notification.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Notifications {
  public http = inject(HttpClient);

  // WILL BE DELETED AFTER INTERCEPTOR
  public userSignIn(): Observable<any> {
    return this.http.post(`https://tia.up.railway.app/auth/login`, {
      username: 'JOHNDOE',
      password: 'pass123123',
    });
  }

  public mfaVerification(object: any): Observable<any> {
    return this.http.post(`https://tia.up.railway.app/auth/mfa/verify`, object);
  }

  // ////////////////////////////

  public hasUnreadNotification(): Observable<HasUnreadNotifications> {
    return this.http.get<HasUnreadNotifications>(
      `${environment.apiUrl}/notifications/has-unread`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT-Token')}`,
        },
      },
    );
  }

  public getNotifications(
    cursor?: string,
    limit: number = 10,
  ): Observable<NotificationsData> {
    let params = new HttpParams().set('page[limit]', limit);

    if (cursor) {
      params = params.set('page[cursor]', cursor);
    }

    return this.http.get<NotificationsData>(
      `${environment.apiUrl}/notifications`,
      {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT-Token')}`,
        },
      },
    );
  }
}
