import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  CardDesignsBackendResponse,
  CardDesignsResponse,
} from '../models/card-design.model';
import { CardCategoriesResponse } from '../models/card-category.model';
import {
  CreateCardRequest,
  CreateCardResponse,
} from '../models/create-card-request.model';
import { environment } from '../../../../../../../environments/environment';
import { CardTypesResponse } from '../models/card-type.model';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cards`;

  getCardImage(cardId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/${cardId}/image`, {
      responseType: 'text',
    });
  }

  getCardDesigns(): Observable<CardDesignsResponse> {
    return this.http
      .get<CardDesignsBackendResponse>(`${this.apiUrl}/designs`)
      .pipe(
        map((designs) =>
          designs.map((design) => ({
            id: design.design,
            designName: design.designName,
            uri: `${environment.apiUrl}${design.uri}`,
          })),
        ),
      );
  }

  getCardCategories(): Observable<CardCategoriesResponse> {
    return this.http.get<CardCategoriesResponse>(
      `${this.apiUrl}/categories-catalog`,
    );
  }

  getCardTypes(): Observable<CardTypesResponse> {
    return this.http.get<CardTypesResponse>(`${this.apiUrl}/types-catalog`);
  }

  createCard(request: CreateCardRequest): Observable<CreateCardResponse> {
    return this.http.post<CreateCardResponse>(
      `${this.apiUrl}/request-card`,
      request,
    );
  }
}
