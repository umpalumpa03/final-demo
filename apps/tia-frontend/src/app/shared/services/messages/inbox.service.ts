import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { InboxCount } from '@tia/shared/models/inbox/inbox.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InboxService {
  public readonly http = inject(HttpClient);

  public readonly inboxCount = signal<number>(0);

  // public getInboxCount(): Observable<InboxCount> {
  //   return this.http.get<InboxCount>(
  //     `${environment.apiUrl}/mails/unread/count`,
  //     {},
  //   );
  // }

  public fetchInboxCount(): void {
    this.http.get<InboxCount>(
      `${environment.apiUrl}/mails/unread/count`,
      {},
    ).subscribe((response) => {
      this.inboxCount.set(response.count);
    });
  }
}
