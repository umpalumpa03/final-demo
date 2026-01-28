import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { InboxCount } from '@tia/shared/models/inbox/inbox.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InboxService {
  public readonly http = inject(HttpClient);

  public getInboxCount(): Observable<InboxCount> {
    return this.http.get<InboxCount>(
      `${environment.apiUrl}/mails/unread/count`,
      {},
    );
  }
}
