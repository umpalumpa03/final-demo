import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HasUnreadNotifications,
  NotificationsData,
} from '../models/notification.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Notifications {
  public http = inject(HttpClient);

  public hasUnreadNotification(): Observable<HasUnreadNotifications> {
    return this.http.get<HasUnreadNotifications>(
      `${environment.apiUrl}/notifications/has-unread`,
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
      },
    );
  }

  public removeNotification(id: string) {
    return this.http.delete(`${environment.apiUrl}/notifications/${id}`);
  }

  public markAllAsRead() {
    return this.http.patch(`${environment.apiUrl}/notifications/read-all`, {});
  }

  public deleteAll() {
    return this.http.delete(`${environment.apiUrl}/notifications/remove-all`);
  }

  public markNotificationRead(id: string) {
    return this.http.patch(
      `${environment.apiUrl}/notifications/${id}/read`,
      {},
    );
  }
}
