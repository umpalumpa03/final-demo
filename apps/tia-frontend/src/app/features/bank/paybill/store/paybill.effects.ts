import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import { PaybillService } from '../services/paybill/paybill-service';
import { PaybillActions, TemplatesPageActions } from './paybill.actions';
import {
  selectPaymentPayload,
  selectSelectedCategoryId,
  selectSelectedProviderId,
} from './paybill.selectors';
import { ProceedPaymentResponse } from '../components/paybill-main/shared/models/paybill.model';
import { PaybillTemplatesService } from '../components/paybill-templates/services/paybill-templates-service';
import { Router } from '@angular/router';

@Injectable()
export class PaybillEffect {
  public store = inject(Store);
  public actions$ = inject(Actions);
  public paybillService = inject(PaybillService);
  public payBillTemplatesService = inject(PaybillTemplatesService);
  public router = inject(Router);

  loadCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaybillActions.loadCategories),
      mergeMap(() =>
        this.paybillService.getCategories().pipe(
          map((categories) =>
            PaybillActions.loadCategoriesSuccess({ categories }),
          ),
          catchError((error) =>
            of(PaybillActions.loadCategoriesFailure({ error: error.message })),
          ),
        ),
      ),
    );
  });

  loadProviders$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PaybillActions.selectCategory),
        mergeMap(({ categoryId }) =>
          this.paybillService.getProviders(categoryId).pipe(
            map((providers) =>
              PaybillActions.loadProvidersSuccess({ providers }),
            ),
            catchError((error) =>
              of(PaybillActions.loadProvidersFailure({ error: error.message })),
            ),
          ),
        ),
      );
    },
    { functional: true },
  );

  autoSelectProviderAfterLoad$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaybillActions.loadProvidersSuccess),
      withLatestFrom(this.store.select(selectSelectedProviderId)),
      mergeMap(([action, selectedProviderId]) => {
        if (selectedProviderId && action.providers.length > 0) {
          return of(
            PaybillActions.selectProvider({ providerId: selectedProviderId }),
          );
        }
        return of();
      }),
    );
  });

  checkBill$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaybillActions.checkBill),
      mergeMap(({ serviceId, accountNumber }) =>
        this.paybillService.checkBill(serviceId, accountNumber).pipe(
          map((details) => PaybillActions.checkBillSuccess({ details })),
          catchError((err) =>
            of(PaybillActions.checkBillFailure({ error: err.message })),
          ),
        ),
      ),
    );
  });

  proceedPayment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaybillActions.proceedPayment),
      mergeMap(({ payload }) =>
        this.paybillService.payBill(payload).pipe(
          map((response: ProceedPaymentResponse) =>
            PaybillActions.proceedPaymentSuccess({ response }),
          ),
          catchError((error) =>
            of(PaybillActions.proceedPaymentFailure({ error: error.message })),
          ),
        ),
      ),
    );
  });

  proceedPaymentSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaybillActions.proceedPaymentSuccess),
      withLatestFrom(this.store.select(selectPaymentPayload)),
      map(([{ response }, payload]) => {
        const amount = payload?.amount ?? 0;

        if (amount >= 50 && response.verify?.challengeId) {
          return PaybillActions.setPaymentStep({ step: 'OTP' });
        }

        return PaybillActions.setPaymentStep({ step: 'SUCCESS' });
      }),
    );
  });

  confirmPayment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaybillActions.confirmPayment),
      mergeMap(({ payload }) =>
        this.paybillService.verifyPayment(payload).pipe(
          map((response) => {
            if (response.success) {
              return PaybillActions.setPaymentStep({ step: 'SUCCESS' });
            }

            return PaybillActions.confirmPaymentFailure({
              error: response.message || 'Invalid code',
            });
          }),
          catchError((error) =>
            of(PaybillActions.confirmPaymentFailure({ error: error.message })),
          ),
        ),
      ),
    );
  });

  selectCategoryNavigation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PaybillActions.selectCategory),
        tap(({ categoryId }) => {
          if (categoryId.toUpperCase() !== 'TEMPLATES') {
            this.router.navigate([
              '/bank/paybill/pay',
              categoryId.toLowerCase(),
            ]);
          }
        }),
      ),
    { dispatch: false },
  );

  selectProviderNavigation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PaybillActions.selectProvider),
        withLatestFrom(this.store.select(selectSelectedCategoryId)),
        tap(([{ providerId }, categoryId]) => {
          if (categoryId) {
            this.router.navigate([
              '/bank/paybill/pay',
              categoryId.toLowerCase(),
              providerId.toLowerCase(),
            ]);
          }
        }),
      ),
    { dispatch: false },
  );

  clearSelectionNavigation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PaybillActions.clearSelection),
        tap(() => {
          this.router.navigate(['/bank/paybill/pay']);
        }),
      ),
    { dispatch: false },
  );

  loadTemplateGroups$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplatesPageActions.loadTemplates),
      mergeMap(() =>
        this.payBillTemplatesService.getAllTemplateGroups().pipe(
          map((templateGroups) =>
            TemplatesPageActions.loadTemplatesSuccess({ templateGroups }),
          ),
          catchError((error) =>
            of(
              TemplatesPageActions.loadTemplatesFailure({
                error: error.message,
              }),
            ),
          ),
        ),
      ),
    );
  });
}
