import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PaybillCategory, PaybillProvider } from '../../models/paybill.model';
import { map, Observable, tap } from 'rxjs';
import { environment } from 'apps/tia-frontend/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaybillService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/paybill`;

  private get headers() {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  public getCategories(): Observable<PaybillCategory[]> {
    return this.http.get<PaybillCategory[]>(`${this.baseUrl}/categories`, {
      headers: this.headers,
    });
  }

  public getProviders(category: string): Observable<PaybillProvider[]> {
    return this.http.get<PaybillProvider[]>(
      `${this.baseUrl}/${category.toLowerCase()}`,
      {
        headers: this.headers,
      },
    );
  }
}
