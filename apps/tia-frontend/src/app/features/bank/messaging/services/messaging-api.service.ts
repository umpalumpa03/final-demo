import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { EmailDetailData, EmailRepliesData, MailsResponse, SendEmailRequest, User } from '../store/messaging.state';
@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/mails`;
  private readonly baseUrl1 = `${environment.apiUrl}/users`; //ეს დროებით იქნება აქ

  public getInbox(type: string, limit: number, cursor?: string | null): Observable<MailsResponse> {
    const params: Record<string, string | number> = { type, limit };
    if (cursor) params['cursor'] = cursor;
    return this.http.get<MailsResponse>(this.baseUrl, { params });
  }

  public sendEmail(data: SendEmailRequest): Observable<void> {
    return this.http.post<void>(this.baseUrl, data);
  }

  public markAsRead(mailId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${mailId}/read`, {});
  }

  public deleteMail(mailId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${mailId}`);
  }

  public searchByEmail(query: string): Observable<User[]> {
    const params = { email: query };
    return this.http.get<User[]>(`${this.baseUrl1}/search-by-email`, { params });
  }

  public getEmailById(mailId: number): Observable<EmailDetailData> {
    return this.http.get<EmailDetailData>(`${this.baseUrl}/${mailId}`);
  }

  public getTotalCount(type: string): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/total`, { params: { type } });
  }

  public getDraftTotalCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/drafts/total`);
  }

  public getImportantUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/importants/unread`);
  }

  public togleFavorite(mailId: number, isFavorite: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/mark-as-favorite`, { id: mailId, isFavorite });
  }

  public sendDraft(mailId: number, data: SendEmailRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${mailId}`, data);
  }

  public getMailReplies(mailId: number): Observable<EmailRepliesData[]> {
    return this.http.get<EmailRepliesData[]>(`${this.baseUrl}/${mailId}/replies`);
  }

  public sendMailReply(mailId: number, body: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${mailId}/reply`, { body });
  }
}
