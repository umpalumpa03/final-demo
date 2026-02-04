import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'apps/tia-frontend/src/environments/environment';
import { PendingCard } from '../model/approve-cards.model';
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
}
