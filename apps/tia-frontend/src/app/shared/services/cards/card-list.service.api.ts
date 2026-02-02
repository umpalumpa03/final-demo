// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { map, Observable } from 'rxjs';
// import { environment } from '../../../../environments/environment';
// import { CardAccountsResponse } from '@tia/shared/models/cards/card-account.model';
// import { CardDetailsResponse } from '@tia/shared/models/cards/card-detail.model';
// import {
//   CardDesignsBackendResponse,
//   CardDesignsResponse,
// } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-design.model';
// import { CardCategoriesResponse } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-category.model';
// import { CardTypesResponse } from '@tia/shared/models/cards/card-type.model';
// import {
//   CreateCardRequest,
//   CreateCardResponse,
// } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/create-card-request.model';

// @Injectable({
//   providedIn: 'root',
// })
// export class CardListService {
//   private readonly http = inject(HttpClient);
//   private readonly apiUrl = `${environment.apiUrl}/cards`;

//   getCardAccounts(): Observable<CardAccountsResponse> {
//     return this.http.get<CardAccountsResponse>(`${this.apiUrl}/accounts`);
//   }

//   getCardImage(cardId: string): Observable<string> {
//     return this.http.get(`${this.apiUrl}/${cardId}/image`, {
//       responseType: 'text',
//     });
//   }
//   getCardDetails(cardId: string): Observable<CardDetailsResponse> {
//     return this.http.get<CardDetailsResponse>(`${this.apiUrl}/${cardId}`);
//   }
//   getCardDesigns(): Observable<CardDesignsResponse> {
//     return this.http
//       .get<CardDesignsBackendResponse>(`${this.apiUrl}/designs`)
//       .pipe(
//         map((designs) =>
//           designs.map((design) => ({
//             id: design.design,
//             designName: design.designName,
//             uri: `${environment.apiUrl}${design.uri}`,
//           })),
//         ),
//       );
//   }
//   getCardCategories(): Observable<CardCategoriesResponse> {
//     return this.http.get<CardCategoriesResponse>(
//       `${this.apiUrl}/categories-catalog`,
//     );
//   }

//   getCardTypes(): Observable<CardTypesResponse> {
//     return this.http.get<CardTypesResponse>(`${this.apiUrl}/types-catalog`);
//   }

//   createCard(request: CreateCardRequest): Observable<CreateCardResponse> {
//     return this.http.post<CreateCardResponse>(
//       `${this.apiUrl}/request-card`,
//       request,
//     );
//   }
// }
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CardAccountsResponse } from '@tia/shared/models/cards/card-account.model';
import { CardDetailsResponse } from '@tia/shared/models/cards/card-detail.model';

@Injectable({
  providedIn: 'root',
})
export class CardListApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cards`;

  getCardAccounts(): Observable<CardAccountsResponse> {
    return this.http.get<CardAccountsResponse>(`${this.apiUrl}/accounts`);
  }

  getCardDetails(cardId: string): Observable<CardDetailsResponse> {
    return this.http.get<CardDetailsResponse>(`${this.apiUrl}/${cardId}`);
  }
}