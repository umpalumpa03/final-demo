import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { RecipientResponse } from '../models/transfers.state.model';

@Injectable({ providedIn: 'root' })
export class TransfersApiService {
  private readonly baseURL = `${environment.apiUrl}/transfers`;
  private readonly http = inject(HttpClient);

  // validate recipient
  public lookupByPhone(phoneNumber: string): Observable<RecipientResponse> {
    return this.http.post<RecipientResponse>(
      `${this.baseURL}/tia-transfer/lookup-recipient-by-personal-info`,
      {
        identifier: phoneNumber,
        identifierType: 'phoneNumber',
      },
    );
  }

  // validate recipient by IBAN
  public lookupByIban(iban: string): Observable<RecipientResponse> {
    return this.http.post<RecipientResponse>(
      `${this.baseURL}/tia-transfer/lookup-recipient-by-iban`,
      { iban },
    );
  }

  // Get transfer fee
  public getFee(
    senderAccountId: string,
    amountToSend: number,
  ): Observable<{ fee: number }> {
    return this.http.get<{ fee: number }>(`${this.baseURL}/get-fee`, {
      params: {
        senderAccountId,
        amountToSend: amountToSend.toString(),
      },
    });
  }
}
