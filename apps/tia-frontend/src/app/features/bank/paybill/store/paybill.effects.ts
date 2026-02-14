import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  concatMap,
  EMPTY,
  filter,
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
  selectCategories,
  selectCategoriesLoaded,
  selectPaymentPayload,
  selectProviders,
  selectSelectedProviderId,
  selectTemplatesGroup,
  selectTemplatesLoaded,
} from './paybill.selectors';
import {
  PaybillIdentification,
  ProceedPaymentResponse,
} from '../components/paybill-main/shared/models/paybill.model';
import { PaybillTemplatesService } from '../components/paybill-templates/services/paybill-templates-service';
import { Event, NavigationStart, Router } from '@angular/router';
import { PaybillErrorPayload } from './paybill.state';
import { selectTransactionToRepeat } from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { PaybillTransactionMeta } from '../components/shared/models/transactions.model';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PaybillEffect {
  public store = inject(Store);
  public actions$ = inject(Actions);
  public paybillService = inject(PaybillService);
  public payBillTemplatesService = inject(PaybillTemplatesService);
  public router = inject(Router);
  public alertService = inject(AlertService);
  public readonly translate = inject(TranslateService);

  private readonly successMessages: Record<string, string> = {
    '[Paybill Templates Page] Delete Template Success':
      'templates.notifications.delete_success',
    '[Paybill Templates Page] Rename Template Success':
      'templates.notifications.rename_success',
    '[Paybill Templates Page] Delete Template Group Success':
      'templates.notifications.group_delete_success',
    '[Paybill Templates Page] Create Templates Groups Success':
      'templates.notifications.group_create_success',
    '[Paybill Templates Page] Rename Template Group Success':
      'templates.notifications.group_rename_success',
    '[Paybill Templates Page] Move Template Success':
      'templates.notifications.move_success',
    '[Paybill Templates Page] Create Template Success':
      'templates.notifications.create_success',
    '[Paybill Templates Page] Pay Many Bills Success':
      'templates.notifications.bulk_pay_success',
    '[Paybill] Proceed Payment Success': 'main.success.title',
    '[Paybill] Confirm Payment Success': 'main.otp.verify_success',
  };

  private readonly errorMapping: Record<string, string> = {
    'Insufficient balance': 'paybill.main.errors.insufficient_balance',
    'Invalid account number': 'paybill.main.errors.invalid_account',
    'Invalid code': 'paybill.main.errors.invalid_code',
    'Account not found. Please check your account number.':
      'paybill.main.form.account_error',
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
      withLatestFrom(this.store.select(selectCategoriesLoaded)),
      filter(([action, loaded]) => !loaded),
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

  loadProviders$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaybillActions.selectCategory),
      withLatestFrom(this.store.select(selectProviders)),
      filter(([{ categoryId }, existingProviders]) => {
        return (
          existingProviders.length === 0 ||
          existingProviders[0].categoryId !== categoryId
        );
      }),
      switchMap(([{ categoryId }]) =>
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
  });

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
        return EMPTY;
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
      switchMap(([{ response }, payload]) => {
        const amount = payload?.amount ?? 0;
        const challengeId = response.verify?.challengeId;

        if (amount > 50 && challengeId) {
          this.router.navigate(['/bank/paybill/pay/otp-verification']);
          return EMPTY;
        }

        if (challengeId) {
          return of(
            PaybillActions.confirmPayment({
              payload: { challengeId, code: '6767' },
            }),
          );
        }

        return EMPTY;
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
              if (!this.router.url.includes('templates')) {
                this.router.navigate(['/bank/paybill/pay/payment-success']);
              }
              return [
                PaybillActions.confirmPaymentSuccess(),
                TransactionActions.loadTransactions({ forceRefresh: true }),
              ];
            }

            return of(
              PaybillActions.confirmPaymentFailure({
                error: response.message || 'Invalid Code',
              }),
            );
          }),
          catchError((error) => {
            const errorBody = error?.error as PaybillErrorPayload;
            return of(
              PaybillActions.confirmPaymentFailure({
                error: errorBody?.message || error.message,
              }),
            );
          }),
        ),
      ),
    );
  });

  loadTemplateGroups$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplatesPageActions.loadTemplateGroups),
      withLatestFrom(this.store.select(selectTemplatesGroup)),
      filter(([_, groups]) => !groups || groups.length === 0),
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
      withLatestFrom(this.store.select(selectTemplatesLoaded)),
      filter(([action, loaded]) => !loaded),
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

  actionSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          ...Object.keys(this.successMessages),
          PaybillActions.confirmPaymentSuccess,
        ),
        tap((action) => {
          const key = this.successMessages[action.type] || 'main.success.title';
          this.alertService.success(this.translate.instant(`paybill.${key}`));
        }),
      );
    },
    { dispatch: false },
  );

  actionFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          TemplatesPageActions.deleteTemplateFailure,
          TemplatesPageActions.renameTemplateFailure,
          TemplatesPageActions.deleteTemplateGroupFailure,
          TemplatesPageActions.createTemplatesGroupsFailure,
          TemplatesPageActions.loadTemplateGroupsFailure,
          TemplatesPageActions.loadTemplatesFailure,
          TemplatesPageActions.checkBillForTemplateFailure,
          PaybillActions.checkBillFailure,
          PaybillActions.proceedPaymentFailure,
          PaybillActions.confirmPaymentFailure,
          PaybillActions.loadCategoriesFailure,
          PaybillActions.loadProvidersFailure,
        ),
        tap(({ error }) => {
          const translationKey =
            this.errorMapping[error] ||
            error ||
            'paybill.main.errors.default_error';
          this.alertService.error(this.translate.instant(translationKey));
        }),
      );
    },
    { dispatch: false },
  );

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
                  groupId,
                  templateId,
                }),
              );
            }

            return this.payBillTemplatesService
              .addTemplateToGroup(groupId, templateId)
              .pipe(
                map(() =>
                  TemplatesPageActions.moveTemplateSuccess({
                    message: 'Item moved successfully',
                    groupId,
                    templateId,
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

  createTemplate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplatesPageActions.createTemplate),
      switchMap(({ serviceId, identification, nickname }) =>
        this.paybillService
          .createTemplate(serviceId, identification, nickname)
          .pipe(
            map((response) =>
              TemplatesPageActions.createTemplateSuccess({
                payload: response,
                message: response.message || 'Template saved successfully',
              }),
            ),
            catchError((error) =>
              of(
                TemplatesPageActions.createTemplateFailure({
                  error: this.getErrorMessage(error),
                }),
              ),
            ),
          ),
      ),
    );
  });

  loadChildProviders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TemplatesPageActions.selectProvider),
      withLatestFrom(this.store.select(selectProviders)),
      mergeMap(([{ providerId, level }, allProviders]) => {
        const childProviders = allProviders.filter(
          (p) => p.parentId === providerId,
        );
        if (childProviders.length === 0) {
          return [
            TemplatesPageActions.loadChildProvidersSuccess({
              providers: childProviders,
              level: level + 1,
            }),
            PaybillActions.loadPaymentDetails({ serviceId: providerId }),
            PaybillActions.selectProvider({ providerId }),
          ];
        }

        return [
          TemplatesPageActions.loadChildProvidersSuccess({
            providers: childProviders,
            level: level + 1,
          }),
        ];
      }),
      catchError((error) =>
        of(
          TemplatesPageActions.loadChildProvidersFailure({
            error: error.message,
          }),
        ),
      ),
    ),
  );

  checkBillAndCreateTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TemplatesPageActions.checkBillForTemplate),
      switchMap(({ serviceId, identification, nickname }) =>
        this.paybillService.checkBill(serviceId, identification).pipe(
          map((response) => {
            if (!response.valid || response.error) {
              return TemplatesPageActions.checkBillForTemplateFailure({
                error: response.error || 'Bill check failed',
              });
            }

            return TemplatesPageActions.createTemplate({
              nickname,
              serviceId,
              identification,
            });
          }),
          catchError((error) =>
            of(
              TemplatesPageActions.checkBillForTemplateFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  hydrateFromRepeatTransaction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaybillActions.initRepeatProcess),
      withLatestFrom(
        this.store.select(selectTransactionToRepeat),
        this.store.select(selectCategories),
      ),
      filter(([_, transaction]) => !!transaction),

      switchMap(([_, transaction, categories]) => {
        const tx = transaction as unknown as ITransactions;

        const meta = tx.meta as unknown as PaybillTransactionMeta;

        const serviceId = meta?.serviceId;
        const senderAccountId = meta?.senderAccountId;
        const identification = meta?.identification as PaybillIdentification;

        let categoryId = meta?.categoryId || 'utilities';

        if (!categoryId) {
          const match = categories.find((cat) =>
            cat.providers?.some((p) => p.id === serviceId),
          );
          categoryId = match!.id;
        }

        this.router.navigate(['/bank/paybill/pay', categoryId, serviceId]);

        return [
          PaybillActions.loadPaymentDetails({ serviceId }),
          PaybillActions.selectCategory({ categoryId }),
          PaybillActions.selectProvider({ providerId: serviceId }),
          PaybillActions.checkBill({ serviceId, identification }),
          PaybillActions.setPaymentPayload({
            data: {
              identification,
              amount: tx.amount,
              senderAccountId,
            },
          }),
        ];
      }),
    );
  });

  payManyBill$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TemplatesPageActions.payManyBills),
      switchMap(({ payments }) =>
        this.payBillTemplatesService.payManyBills(payments).pipe(
          switchMap((response) => [
            TemplatesPageActions.payManyBillsSuccess({ response }),
            TransactionActions.loadTransactions({ forceRefresh: true }),
          ]),
          catchError((error) =>
            of(
              TemplatesPageActions.checkBillForTemplateFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  clearStateOnNavigation$ = createEffect(() => {
    return this.router.events.pipe(
      filter(
        (event: Event): event is NavigationStart =>
          event instanceof NavigationStart,
      ),
      filter((event: NavigationStart) => {
        const url: string = event.url;
        return url === '/bank/paybill' || !url.includes('/bank/paybill/pay');
      }),
      map(() => PaybillActions.clearSelection()),
    );
  });
}
