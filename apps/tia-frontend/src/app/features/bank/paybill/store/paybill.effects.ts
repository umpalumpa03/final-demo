import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  concatMap,
  delay,
  EMPTY,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { PaybillService } from '../services/paybill/paybill-service';
import { PaybillActions, TemplatesPageActions } from './paybill.actions';
import {
  selectNotifications,
  selectPaymentPayload,
  selectSelectedCategoryId,
  selectSelectedProviderId,
} from './paybill.selectors';
import { ProceedPaymentResponse } from '../components/paybill-main/shared/models/paybill.model';
import { PaybillTemplatesService } from '../components/paybill-templates/services/paybill-templates-service';
import { Router } from '@angular/router';
import { PaybillErrorPayload } from './paybill.state';

@Injectable()
export class PaybillEffect {
  public store = inject(Store);
  public actions$ = inject(Actions);
  public paybillService = inject(PaybillService);
  public payBillTemplatesService = inject(PaybillTemplatesService);
  public router = inject(Router);

  private successMessages: Record<string, string> = {
    '[Paybill Templates Page] Delete Template Success':
      'Template deleted successfully',
    '[Paybill Templates Page] Rename Template Success':
      'Template renamed successfully',
    '[Paybill Templates Page] Delete Template Group Success':
      'Group deleted successfully',
    '[Paybill Templates Page] Create Templates Groups Success':
      'Group created successfully',
    '[Paybill Templates Page] Rename Template Group Success':
      'Group renamed successfully',
    '[Paybill Templates Page] Move Template Success':
      'Template moved successfully',
  };

  private getErrorMessage(error: any): string {
    if (typeof error?.error === 'string') return error.error;
    if (error?.error?.message) return error.error.message;
    if (error?.message) return error.message;
    return 'paybill.main.form.default_error';
  }

  loadCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaybillActions.loadCategories),
      mergeMap(() =>
        this.paybillService.getCategories().pipe(
          map((categories) =>
            PaybillActions.loadCategoriesSuccess({ categories }),
          ),
          catchError((error) =>
            of(
              PaybillActions.loadCategoriesFailure({
                error: this.getErrorMessage(error),
              }),
            ),
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
              of(
                PaybillActions.loadProvidersFailure({
                  error: this.getErrorMessage(error),
                }),
              ),
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

  checkBill$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaybillActions.checkBill),
      mergeMap(({ serviceId, identification }) =>
        this.paybillService.checkBill(serviceId, identification).pipe(
          map((details) => {
            if (details.valid === false) {
              return PaybillActions.checkBillFailure({
                error: details.error || 'paybill.main.form.default_error',
              });
            }
            return PaybillActions.checkBillSuccess({ details });
          }),
          catchError((error) =>
            of(
              PaybillActions.checkBillFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  proceedPayment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaybillActions.proceedPayment),
      mergeMap(({ payload }) =>
        this.paybillService.payBill(payload).pipe(
          map((response: ProceedPaymentResponse) => {
            if (response.statusCode && response.message) {
              return PaybillActions.proceedPaymentFailure({
                error: response.message,
              });
            }
            return PaybillActions.proceedPaymentSuccess({ response });
          }),
          catchError((error) =>
            of(
              PaybillActions.proceedPaymentFailure({
                error: error?.error?.message,
              }),
            ),
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
          mergeMap((response) => {
            if (response.success) {
              this.router.navigate(['/bank/paybill/pay/payment-success']);

              return of(
                PaybillActions.addNotification({
                  notificationType: 'success',
                  message: 'OTP Verified Successfully',
                }),
              );
            }

            return of(
              PaybillActions.addNotification({
                notificationType: 'warning',
                message: response.message || 'Invalid Code',
              }),
            );
          }),
          catchError((error) => {
            const errorBody = error?.error as PaybillErrorPayload;
            const displayMessage = errorBody?.message || error.message;

            return of(
              PaybillActions.addNotification({
                notificationType: 'warning',
                message: displayMessage,
              }),
            );
          }),
        ),
      ),
    );
  });

  autoDismissNotifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaybillActions.addNotification),
      delay(100),
      withLatestFrom(this.store.select(selectNotifications)),
      mergeMap(([action, notifications]) => {
        const lastNotification = notifications[notifications.length - 1];

        if (!lastNotification) return EMPTY;

        return of(
          PaybillActions.dismissNotification({ id: lastNotification.id! }),
        ).pipe(delay(3000));
      }),
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
      ofType(TemplatesPageActions.loadTemplateGroups),
      mergeMap(() =>
        this.payBillTemplatesService.getAllTemplateGroups().pipe(
          map((templateGroups) =>
            TemplatesPageActions.loadTemplateGroupsSuccess({ templateGroups }),
          ),
          catchError((error) =>
            of(
              TemplatesPageActions.loadTemplateGroupsFailure({
                error: error.message,
              }),
            ),
          ),
        ),
      ),
    );
  });

  loadTemplates$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplatesPageActions.loadTemplates),
      mergeMap(() =>
        this.payBillTemplatesService.getAllTemplates().pipe(
          map((templates) =>
            TemplatesPageActions.loadTemplatesSuccess({ templates }),
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

  // All success notifications
  actionSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        TemplatesPageActions.deleteTemplateSuccess,
        TemplatesPageActions.renameTemplateSuccess,
        TemplatesPageActions.deleteTemplateGroupSuccess,
        TemplatesPageActions.createTemplatesGroupsSuccess,
        TemplatesPageActions.renameTemplateGroupSuccess,
        TemplatesPageActions.moveTemplateSuccess,
      ),
      map((action) =>
        PaybillActions.addNotification({
          notificationType: 'success',
          message:
            this.successMessages[action.type] ??
            'Action completed successfully',
        }),
      ),
    );
  });

  // All failure notifications
  actionFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        TemplatesPageActions.deleteTemplateFailure,
        TemplatesPageActions.renameTemplateFailure,
        TemplatesPageActions.deleteTemplateGroupFailure,
        TemplatesPageActions.createTemplatesGroupsFailure,
        TemplatesPageActions.loadTemplateGroupsFailure,
        TemplatesPageActions.loadTemplatesFailure,
        PaybillActions.checkBillFailure,
        PaybillActions.proceedPaymentFailure,
        PaybillActions.loadCategoriesFailure,
        PaybillActions.loadProvidersFailure,
      ),
      map(({ error }) =>
        PaybillActions.addNotification({
          notificationType: 'warning',
          message: error,
        }),
      ),
    );
  });

  createTemplatesGroup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplatesPageActions.createTemplatesGroups),
      switchMap((payload) =>
        this.payBillTemplatesService.createTemplateGroups(payload).pipe(
          map((response) =>
            TemplatesPageActions.createTemplatesGroupsSuccess({
              templateGroup: response,
            }),
          ),
          catchError((error) =>
            of(
              TemplatesPageActions.createTemplatesGroupsFailure({
                error: error.message,
              }),
            ),
          ),
        ),
      ),
    );
  });

  deleteTemplates$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplatesPageActions.deleteTemplate),
      switchMap(({ templateId }) =>
        this.payBillTemplatesService.deleteTemplate(templateId).pipe(
          map(({ message }) =>
            TemplatesPageActions.deleteTemplateSuccess({
              message,
              templateId,
            }),
          ),
          catchError((error) =>
            of(
              TemplatesPageActions.deleteTemplateFailure({
                error: error.message,
              }),
            ),
          ),
        ),
      ),
    );
  });

  renameTemplates$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplatesPageActions.renameTemplate),
      switchMap(({ templateId, nickName }) =>
        this.payBillTemplatesService.renameTemplate(templateId, nickName).pipe(
          map((template) =>
            TemplatesPageActions.renameTemplateSuccess({ template }),
          ),
          catchError((error) =>
            of(
              TemplatesPageActions.renameTemplateFailure({
                error: error.message,
              }),
            ),
          ),
        ),
      ),
    );
  });

  deleteTemplateGroup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplatesPageActions.deleteTemplateGroup),
      switchMap(({ groupId }) =>
        this.payBillTemplatesService.deleteGroup(groupId).pipe(
          map((response) =>
            TemplatesPageActions.deleteTemplateGroupSuccess({
              message: response.message,
              groupId,
            }),
          ),
          catchError((error) =>
            of(
              TemplatesPageActions.deleteTemplateGroupFailure({
                error: error.message,
              }),
            ),
          ),
        ),
      ),
    );
  });

  renameTemplateGroup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplatesPageActions.renameTemplateGroup),
      switchMap(({ groupId, groupName }) =>
        this.payBillTemplatesService.renameGroup(groupId, groupName).pipe(
          map((response) =>
            TemplatesPageActions.renameTemplateGroupSuccess({
              templateGroup: response,
              groupId,
              message: 'Group name has been changed',
            }),
          ),
          catchError((error) =>
            of(
              TemplatesPageActions.renameTemplateGroupFailure({
                error: error.message,
              }),
            ),
          ),
        ),
      ),
    );
  });

  loadPaymentDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaybillActions.loadPaymentDetails),
      switchMap(({ serviceId }) =>
        this.paybillService.getPaymentDetails(serviceId).pipe(
          map((details) =>
            PaybillActions.loadPaymentDetailsSuccess({ details }),
          ),
          catchError((error) =>
            of(
              PaybillActions.loadPaymentDetailsFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    );
  });

  moveTemplate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplatesPageActions.moveTemplate),
      concatMap(({ groupId, templateId }) =>
        this.payBillTemplatesService.removeTemplateFromGroup(templateId).pipe(
          concatMap(() => {
            if (groupId === null) {
              return of(
                TemplatesPageActions.moveTemplateSuccess({
                  message: 'Item removed successfully',
                }),
              );
            }

            return this.payBillTemplatesService
              .addTemplateToGroup(groupId, templateId)
              .pipe(
                map(() =>
                  TemplatesPageActions.moveTemplateSuccess({
                    message: 'Item moved successfully',
                  }),
                ),
              );
          }),

          catchError((error) =>
            of(
              PaybillActions.loadPaymentDetailsFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    );
  });
}
