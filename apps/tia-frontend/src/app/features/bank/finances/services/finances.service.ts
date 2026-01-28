import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FinancialSummaryResponse } from '../models/filter.model';
import { environment } from "../../../../../environments/environment"

@Injectable()
export class FinancesService {
  private http = inject(HttpClient);
  

  getSummary(from: string, to?: string) {
    let params = new HttpParams().set('value', from);
    if (to) {
      params = params.set('value2', to);
    }
    return this.http.get<FinancialSummaryResponse>(`${environment.apiUrl}/finances/summary`, { params });
  }
}