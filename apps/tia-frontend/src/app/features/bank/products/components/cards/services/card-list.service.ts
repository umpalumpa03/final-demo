import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardAccountsResponse } from '../models/card-account.model';
import { environment } from 'apps/tia-frontend/src/environments/environment';

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
}