import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { MailsResponse } from '../store/messaging.state';
@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/mails`;

  public getInbox(type: string, limit: number, cursor?: string): Observable<MailsResponse> {
    const params: Record<string, string | number> = { type, limit };
    if (cursor) params['cursor'] = cursor;
    return this.http.get<MailsResponse>(this.baseUrl, { params });
  }

  public markAsRead(mailId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${mailId}/read`, {});
  }
}
