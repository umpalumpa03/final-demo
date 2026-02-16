import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import {
  RecipientResponse,
  TransferResponse,
  TransferVerifyResponse,
} from '../models/transfers.state.model';
import {
  TransferSameBankPayload,
  TransferToOwnPayload,
  TransferCrossCurrencyPayload,
  TransferExternalBankPayload,
  TransferVerifyPayload,
  ConversionRateResponse,
} from '../models/transfers.api.model';

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

  public transferSameBank(
    payload: TransferSameBankPayload,
  ): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(
      `${this.baseURL}/tia-transfers/someone`,
      payload,
    );
  }

  public getConversionRate(
    from: string,
    to: string,
    amount: number = 1,
  ): Observable<ConversionRateResponse> {
    return this.http.get<ConversionRateResponse>(
      `${environment.apiUrl}/exchange-rates/convert`,
      {
        params: {
          from,
          to,
          amount: amount.toString(),
        },
      },
    );
  }

  public transferToOwn(
    payload: TransferToOwnPayload,
  ): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(
      `${this.baseURL}/between-own-accounts`,
      payload,
    );
  }

  public transferCrossCurrency(
    payload: TransferCrossCurrencyPayload,
  ): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(`${this.baseURL}/convert`, payload);
  }

  public transferExternalBank(
    payload: TransferExternalBankPayload,
  ): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(
      `${this.baseURL}/someone/external-bank`,
      payload,
    );
  }

  public verifyTransfer(
    payload: TransferVerifyPayload,
  ): Observable<TransferVerifyResponse> {
    return this.http.post<TransferVerifyResponse>(`${this.baseURL}/verify`, {
      challengeId: payload.challengeId,
      ...(payload.code && { code: payload.code }),
    });
  }

  public resendOtp(challengeId: string): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.baseURL}/mfa/resend-otp`,
      challengeId,
    );
  }
}
