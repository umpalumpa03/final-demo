import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardAccountsResponse } from '../models/card-account.model';
import { environment } from '../../../../../../../environments/environment';
import { CardDetailsResponse } from '../models/card-detail.model';

@Injectable({
  providedIn: 'root',
})
export class CardListService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cards`;

  getCardAccounts(): Observable<CardAccountsResponse> {
    return this.http.get<CardAccountsResponse>(`${this.apiUrl}/accounts`);
  }

  getCardImage(cardId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/${cardId}/image`, {
      responseType: 'text',
    });
  }
   getCardDetails(cardId: string): Observable<CardDetailsResponse> {
    return this.http.get<CardDetailsResponse>(`${this.apiUrl}/${cardId}`);
  }
}