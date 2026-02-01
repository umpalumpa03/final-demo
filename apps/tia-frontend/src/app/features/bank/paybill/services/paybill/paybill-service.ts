import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BillDetails,
  ConfirmPaymentPayload,
  PaybillCategory,
  PaybillProvider,
  ProceedPaymentPayload,
  ProceedPaymentResponse,
} from '../../components/paybill-main/shared/models/paybill.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaybillService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/paybill`;

  public getCategories(): Observable<PaybillCategory[]> {
    return this.http.get<PaybillCategory[]>(`${this.baseUrl}/categories`);
  }

  public getProviders(category: string): Observable<PaybillProvider[]> {
    return this.http.get<PaybillProvider[]>(
      `${this.baseUrl}/${category.toLowerCase()}`,
    );
  }

  public checkBill(
    serviceId: string,
    accountNumber: string,
  ): Observable<BillDetails> {
    const payload = {
      serviceId,
      identification: {
        accountNumber: accountNumber,
      },
    };

    return this.http.post<BillDetails>(`${this.baseUrl}/check-bill`, payload);
  }

  public payBill(
    data: ProceedPaymentPayload,
  ): Observable<ProceedPaymentResponse> {
    return this.http.post<ProceedPaymentResponse>(`${this.baseUrl}/pay`, data);
  }

  public verifyPayment(payload: ConfirmPaymentPayload): Observable<unknown> {
    return this.http.post<unknown>(`${this.baseUrl}/verify`, payload);
  }
}
