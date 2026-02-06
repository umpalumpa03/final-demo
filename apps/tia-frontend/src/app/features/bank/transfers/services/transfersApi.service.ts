import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import {
  RecipientResponse,
  TransferResponse,
  TransferVerifyResponse
} from '../models/transfers.state.model';

@Injectable({ providedIn: 'root' })
export class TransfersApiService {
  private readonly baseURL = `${environment.apiUrl}/transfers`;
  private readonly http = inject(HttpClient);

  public lookupByPhone(phoneNumber: string): Observable<RecipientResponse> {
    return this.http.post<RecipientResponse>(
      `${this.baseURL}/tia-transfer/lookup-recipient-by-personal-info`,
      {
        identifier: phoneNumber,
        identifierType: 'phoneNumber',
      },
    );
  }

  public lookupByIban(iban: string): Observable<RecipientResponse> {
    return this.http.post<RecipientResponse>(
      `${this.baseURL}/tia-transfer/lookup-recipient-by-iban`,
      { iban },
    );
  }

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

  public transferSameBank(payload: {
    senderAccountId: string;
    receiverAccountIban: string;
    description: string;
    amountToSend: number;
  }): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(
      `${this.baseURL}/tia-transfers/someone`,
      payload,
    );
  }

  public getConversionRate(
    from: string,
    to: string,
    amount: number = 1
  ): Observable<{
    success: boolean;
    query: { from: string; to: string; amount: number };
    result: number;
    rate: number;
  }> {
    return this.http.get<{
      success: boolean;
      query: { from: string; to: string; amount: number };
      result: number;
      rate: number;
    }>(`${environment.apiUrl}/exchange-rates/convert`, {
      params: {
        from,
        to,
        amount: amount.toString(),
      },
    });
  }

  public transferToOwn(payload: {
    senderAccountId: string;
    receiverAccountId: string;
    description: string;
    amountToSend: number;
  }): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(
      `${this.baseURL}/between-own-accounts`,
      payload,
    )
  }

  public transferCrossCurrency(payload: {
    senderAccountId: string;
    receiverAccountId: string;
    description: string;
    amountToSend: number;
    isReverse: boolean;
  }): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(
      `${this.baseURL}/convert`,
      payload,
    )
  }


  public transferExternalBank(payload: {
    senderAccountId: string;
    receiverAccountIban: string;
    receiverAccountCurrency: string;
    receiverName: string;
    amountToSend: number;
    description: string;
  }): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(
      `${this.baseURL}/someone/external-bank`,
      payload,
    );
  }
  public verifyTransfer(payload: {
    challengeId: string;
    code?: string;
  }): Observable<TransferVerifyResponse> {
    return this.http.post<{ success: boolean; transferId: string }>(
      `${this.baseURL}/verify`,
      {
        challengeId: payload.challengeId,
        ...(payload.code && { code: payload.code }),
      },
    );
  }
}
