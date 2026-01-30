import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'apps/tia-frontend/src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransfersApiService {
  private readonly baseURL = `${environment.apiUrl}/transfers`;
  private readonly http = inject(HttpClient);

  //transfers external services
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
