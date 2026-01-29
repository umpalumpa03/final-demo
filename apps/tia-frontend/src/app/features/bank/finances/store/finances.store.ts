import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { FinancesService } from '../services/finances.service';
import { pipe, switchMap, tap, catchError, EMPTY } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { FinancialSummaryResponse } from '../models/filter.model';
import { HttpErrorResponse } from '@angular/common/http';

export const FinancesStore = signalStore(
  withState({
    summary: null as FinancialSummaryResponse | null,
    loading: false,
    error: null as string | null,
  }),
  withMethods((store, financesService = inject(FinancesService)) => ({
    loadSummary: rxMethod<{ from: string; to?: string }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ from, to }) =>
          financesService.getSummary(from, to).pipe(
            tap((data) => patchState(store, { summary: data, loading: false })),
            catchError((err: HttpErrorResponse) => {
              const msg = err.status === 500 
                ? 'Server error: Invalid date format.' 
                : 'Connection failed.';
              
              patchState(store, { 
                loading: false, 
                error: msg, 
                summary: null 
              });
              return EMPTY;
            })
          )
        )
      )
    ),
  }))
);