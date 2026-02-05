import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'apps/tia-frontend/src/environments/environment';
import { PendingCard, UpdateCardStatusRequest } from '../model/approve-cards.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApproveCardsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cards`;

  public getPendingCards(): Observable<PendingCard[]> {
    return this.http.get<PendingCard[]>(`${this.apiUrl}/pending`);
  }

  public changeCardStatus(request: UpdateCardStatusRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/pending`, request);
  }
}
