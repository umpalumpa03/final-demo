import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HasUnreadNotifications,
  NotificationsData,
  successMessage,
  UnreadCount,
} from '../models/notification.model';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Notifications {
  public http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/notifications';

  public hasUnreadNotification(): Observable<HasUnreadNotifications> {
    return this.http.get<HasUnreadNotifications>(`${this.baseUrl}/has-unread`);
  }

  public getNotifications(
    cursor?: string,
    limit: number = 10,
  ): Observable<NotificationsData> {
    let params = new HttpParams().set('page[limit]', limit);

    if (cursor) {
      params = params.set('page[cursor]', cursor);
    }

    return this.http.get<NotificationsData>(`${this.baseUrl}`, {
      params,
    });
  }

  public removeNotification(id: string): Observable<successMessage> {
    return this.http.delete<successMessage>(`${this.baseUrl}/${id}`);
  }

  public markAllAsRead(): Observable<successMessage> {
    return this.http.patch<successMessage>(`${this.baseUrl}/read-all`, {});
  }

  public deleteAll(): Observable<successMessage> {
    return this.http.delete<successMessage>(`${this.baseUrl}/remove-all`);
  }
  public deleteMultiple(ids: string[]): Observable<successMessage> {
    return this.http.delete<successMessage>(`${this.baseUrl}/delete-many`, {
      body: { ids },
    });
  }

  public markNotificationRead(id: string): Observable<successMessage> {
    return this.http.patch<successMessage>(`${this.baseUrl}/${id}/read`, {});
  }

  public getUnreadCount(): Observable<UnreadCount> {
    return this.http.get<UnreadCount>(`${this.baseUrl}/unread-count`);
  }
}
