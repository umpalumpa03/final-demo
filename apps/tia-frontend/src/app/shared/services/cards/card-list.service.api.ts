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

  public resendOtp(challengeId: string): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.apiUrl}/mfa/resend-otp`,
      challengeId,
    );
  }
}
