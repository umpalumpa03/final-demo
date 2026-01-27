import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PaybillCategory } from '../../models/paybill.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaybillService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://tia.up.railway.app/paybill/categories';

  public getCategories(): Observable<PaybillCategory[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<PaybillCategory[]>(this.apiUrl, { headers });
  }
}
