import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CardAccountsResponse } from '@tia/shared/models/cards/card-account.model';
import { CardDetailsResponse } from '@tia/shared/models/cards/card-detail.model';
import { CardDesignsResponse } from '@tia/shared/models/cards/card-design.model';
import { CardCategoriesResponse } from '@tia/shared/models/cards/card-category.model';
import { CardTypesResponse } from '@tia/shared/models/cards/card-type.model';
import { CreateCardRequest, CreateCardResponse } from '@tia/shared/models/cards/create-card-request.model';


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
  
getCardDesigns(): Observable<CardDesignsResponse> {
  return this.http.get<CardDesignsResponse>(`${this.apiUrl}/designs`).pipe(
    map((designs) =>
      designs.map((design) => ({
        ...design,
        uri: `${environment.apiUrl}${design.uri}`,
      }))
    )
  );
}

  getCardCategories(): Observable<CardCategoriesResponse> {
    return this.http.get<CardCategoriesResponse>(`${this.apiUrl}/categories-catalog`);
  }

  getCardTypes(): Observable<CardTypesResponse> {
    return this.http.get<CardTypesResponse>(`${this.apiUrl}/types-catalog`);
  }

  createCard(request: CreateCardRequest): Observable<CreateCardResponse> {
    return this.http.post<CreateCardResponse>(`${this.apiUrl}/request-card`, request);
  }
  
}