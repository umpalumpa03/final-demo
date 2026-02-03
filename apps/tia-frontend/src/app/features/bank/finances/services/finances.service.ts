import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import {
  FinancialSummaryResponse,
  CategoryBreakdown,
  IncomeVsExpenses,
  SavingsTrend,
  DailySpending,
  Transaction,
} from '../models/filter.model';

@Injectable()
export class FinancesService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private getParams(from: string, to?: string): HttpParams {
    let params = new HttpParams().set('value', from);
    if (to) {
      params = params.set('value2', to);
    }
    return params;
  }

  public getSummary(
    from: string,
    to?: string,
  ): Observable<FinancialSummaryResponse> {
    return this.http.get<FinancialSummaryResponse>(
      `${this.apiUrl}/finances/summary`,
      {
        params: this.getParams(from, to),
      },
    );
  }

  public getCategories(
    from: string,
    to?: string,
  ): Observable<CategoryBreakdown[]> {
    return this.http.get<CategoryBreakdown[]>(
      `${this.apiUrl}/finances/category-breakdown`,
      {
        params: this.getParams(from, to),
      },
    );
  }

  public getIncomeVsExpenses(months = 7): Observable<IncomeVsExpenses[]> {
    const params = new HttpParams().set('months', months.toString());
    return this.http.get<IncomeVsExpenses[]>(
      `${this.apiUrl}/finances/income-vs-expenses`,
      {
        params,
      },
    );
  }

  public getSavingsTrend(months = 7): Observable<SavingsTrend[]> {
    const params = new HttpParams().set('months', months.toString());
    return this.http.get<SavingsTrend[]>(
      `${this.apiUrl}/finances/savings-trend`,
      {
        params,
      },
    );
  }

  public getDailySpending(
    from: string,
    to?: string,
  ): Observable<DailySpending[]> {
    return this.http.get<DailySpending[]>(
      `${this.apiUrl}/finances/daily-spending`,
      {
        params: this.getParams(from, to),
      },
    );
  }

  public getRecentTransactions(limit = 6): Observable<Transaction[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Transaction[]>(
      `${this.apiUrl}/finances/recent-transactions`,
      { params },
    );
  }
}
