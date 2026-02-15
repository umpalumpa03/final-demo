import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BillDetails,
  ConfirmPaymentPayload,
  PaybillCategory,
  PaybillIdentification,
  PaybillPaymentDetails,
  PaybillProvider,
  ProceedPaymentPayload,
  ProceedPaymentResponse,
} from '../../components/paybill-main/shared/models/paybill.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Templates } from '../../components/paybill-templates/models/paybill-templates.model';

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
    identification: PaybillIdentification,
  ): Observable<BillDetails> {
    const payload = {
      serviceId,
      identification,
    };

    return this.http.post<BillDetails>(`${this.baseUrl}/check-bill`, payload);
  }

  public payBill(
    data: ProceedPaymentPayload,
  ): Observable<ProceedPaymentResponse> {
    return this.http.post<ProceedPaymentResponse>(`${this.baseUrl}/pay`, data);
  }

  public verifyPayment(
    payload: ConfirmPaymentPayload,
  ): Observable<{ success: boolean; message?: string }> {
    return this.http.post<{ success: boolean; message?: string }>(
      `${this.baseUrl}/verify`,
      payload,
    );
  }

  public getPaymentDetails(
    serviceId: string,
  ): Observable<PaybillPaymentDetails> {
    return this.http.get<PaybillPaymentDetails>(
      `${this.baseUrl}/payment-details/${serviceId}`,
    );
  }

  public createTemplate(
    serviceId: string,
    identification: PaybillIdentification,
    nickname: string,
  ): Observable<Templates> {
    return this.http.post<Templates>(`${this.baseUrl}/templates`, {
      serviceId,
      identification,
      nickname,
    });
  }
}
