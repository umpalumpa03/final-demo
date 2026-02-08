import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../../../environments/environment';
import { CardCatalogItemResponse, PendingCard, UpdateCardStatusRequest } from '../model/approve-cards.model';
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

  public changeCardStatus(updatedCard: UpdateCardStatusRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/change-card-status`, updatedCard);
  }

  public getCardPermissions(): Observable<CardCatalogItemResponse[]> {
    return this.http.get<CardCatalogItemResponse[]>(`${this.apiUrl}/catalog/permissions`);
  }
}
