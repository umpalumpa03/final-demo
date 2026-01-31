import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { pipe, switchMap, tap, map, catchError, EMPTY, delay } from 'rxjs';

import { LoansCreateActions } from 'apps/tia-frontend/src/app/store/loans/loans.actions';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { toTitleCase } from '../shared/utils/titlecase.util';
import { HttpErrorResponse } from '@angular/common/http';

import { LoansService } from '../shared/services/loans.service';
import { loansInitialState } from './loans.state';

export const LoansStore = signalStore(
  withState(loansInitialState),

  withComputed((store) => {
    const globalStore = inject(Store);
    const accountsSignal = globalStore.selectSignal(selectAccounts);

    return {
      loansWithAccountInfo: computed(() => {
        const currentAccounts = accountsSignal() || [];
        return store.loans().map((loan) => {
          const matchedAccount = currentAccounts.find(
            (acc) => acc.id === loan.accountId,
          );
          const accName = matchedAccount
            ? matchedAccount.friendlyName || matchedAccount.name
            : 'Loading Account...';
          return { ...loan, accountName: accName };
        });
      }),

      loanCounts: computed(() => store.dashboardCounts()),

      loanMonthsOptions: computed(() =>
        (store.months() || []).map((m) => ({
          label: `${m} Months`,
          value: m,
        })),
      ),

      purposeOptions: computed(() =>
        (store.purposes() || []).map((p) => ({
          label: p.displayText,
          value: p.value,
        })),
      ),

      alert: computed(() => {
        const message = store.alertMessage();
        const type = store.alertType();

        // Only return the config object if BOTH message and type exist
        // This narrow the type from (LoanAlertType | null) to (LoanAlertType)
        if (message && type) {
          return {
            message,
            type: type as any, // Use 'any' or cast to your specific component's AlertType
          };
        }

        return null;
      }),

      prepaymentTypeOptions: computed(() =>
        store
          .prepaymentOptions()
          .filter((opt) => opt.isActive)
          .map((opt) => ({
            label: opt.prepaymentDisplayName,
            value: opt.prepaymentValue,
          })),
      ),
    };
  }),

  withComputed((store) => ({
    filteredLoans: computed(() => {
      const status = store.filterStatus();
      const loans = store.loansWithAccountInfo();
      if (status === null) return loans;
      return loans.filter((l) => l.status === status);
    }),
  })),

  withMethods((store) => {
    const loansService = inject(LoansService);

    return {
      setFilter(status: number | null) {
        patchState(store, { filterStatus: status });
      },
      clearLoanDetails() {
        patchState(store, { selectedLoanDetails: null, detailsLoading: false });
      },
      clearCalculationResult() {
        patchState(store, { calculationResult: null, activeChallengeId: null });
      },
      hideAlert() {
        patchState(store, { alertMessage: null, alertType: null });
      },

      _triggerAutoHide: rxMethod<void>(
        pipe(
          delay(3000),
          tap(() => patchState(store, { alertMessage: null, alertType: null })),
        ),
      ),

      loadLoans: rxMethod<number | void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((status) => {
            const apiStatus = typeof status === 'number' ? status : undefined;

            return loansService.getAllLoans(apiStatus).pipe(
              tap((loans) => {
                const mappedLoans = loans.map((l) => ({
                  ...l,
                  purpose: toTitleCase(l.purpose) || '',
                  friendlyName: toTitleCase(l.friendlyName),
                  accountName: l.accountName || '',
                }));
                patchState(store, { loans: mappedLoans, loading: false });
              }),
              catchError((error) => {
                patchState(store, { error: error.message, loading: false });
                return EMPTY;
              }),
            );
          }),
        ),
      ),
      loadCounts: rxMethod<void>(
        pipe(
          switchMap(() =>
            loansService.getAllLoans().pipe(
              tap((loans) => {
                const counts = {
                  all: loans.length,
                  approved: loans.filter((l) => l.status === 2).length,
                  pending: loans.filter((l) => l.status === 1).length,
                  declined: loans.filter((l) => l.status === 3).length,
                };
                patchState(store, { dashboardCounts: counts });
              }),
              catchError(() => EMPTY),
            ),
          ),
        ),
      ),

      loadLoanDetails: rxMethod<string>(
        pipe(
          tap(() =>
            patchState(store, {
              detailsLoading: true,
              error: null,
              selectedLoanDetails: null,
            }),
          ),
          switchMap((id) =>
            loansService.getLoanById(id).pipe(
              tap((details) =>
                patchState(store, {
                  selectedLoanDetails: details,
                  detailsLoading: false,
                }),
              ),
              catchError((error) => {
                patchState(store, {
                  error: error.message,
                  detailsLoading: false,
                });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      renameLoan: rxMethod<{ id: string; name: string }>(
        pipe(
          switchMap(({ id, name }) =>
            loansService.updateFriendlyName(id, name).pipe(
              tap(() => {
                const updatedLoans = store
                  .loans()
                  .map((loan) =>
                    loan.id === id ? { ...loan, friendlyName: name } : loan,
                  );
                patchState(store, { loans: updatedLoans });
              }),
              catchError((error) => {
                patchState(store, { error: error.message });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      loadMonths: rxMethod<void>(
        pipe(
          switchMap(() =>
            loansService.getLoanMonths().pipe(
              tap((months) => patchState(store, { months })),
              catchError((error) => {
                patchState(store, { error: error.message });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      loadPurposes: rxMethod<void>(
        pipe(
          switchMap(() =>
            loansService.getPurposes().pipe(
              tap((purposes) => patchState(store, { purposes, error: null })),
              catchError((error) => {
                patchState(store, { error: error.message });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      loadPrepaymentOptions: rxMethod<void>(
        pipe(
          switchMap(() =>
            loansService.getPrepaymentOptions().pipe(
              tap((options) =>
                patchState(store, { prepaymentOptions: options, error: null }),
              ),
              catchError((error) => {
                patchState(store, { error: error.message });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      calculatePrepayment: rxMethod<{ payload: any }>(
        pipe(
          tap(() => patchState(store, { actionLoading: true, error: null })),
          switchMap(({ payload }) => {
            const request$ =
              payload.type === 'full'
                ? loansService
                    .calculateFullPrepayment(payload.loanId)
                    .pipe(map((res) => ({ displayedInfo: res.items || [] })))
                : loansService.calculatePartialPrepayment(
                    payload.loanId,
                    payload.amount!,
                    payload.loanPartialPaymentType!,
                  );

            return request$.pipe(
              tap((result: any) =>
                patchState(store, {
                  calculationResult: result,
                  actionLoading: false,
                }),
              ),
              catchError((error) => {
                patchState(store, {
                  calculationResult: null,
                  actionLoading: false,
                  error: error.message,
                });
                return EMPTY;
              }),
            );
          }),
        ),
      ),
    };
  }),

  withMethods((store) => {
    const loansService = inject(LoansService);
    const actions$ = inject(Actions);

    return {
      showAlert(message: string, alertType: any) {
        patchState(store, { alertMessage: message, alertType });
        store._triggerAutoHide();
      },

      initiatePrepayment: rxMethod<{ payload: any }>(
        pipe(
          tap(() => patchState(store, { actionLoading: true, error: null })),
          switchMap(({ payload }) =>
            loansService.initiatePrepayment(payload).pipe(
              tap((response) => {
                if (response.verify?.challengeId) {
                  patchState(store, {
                    activeChallengeId: response.verify.challengeId,
                    actionLoading: false,
                    alertMessage: 'OTP sent to your registered mobile number',
                    alertType: 'success',
                  });
                  store._triggerAutoHide();
                } else {
                  patchState(store, {
                    error: 'No challenge ID returned',
                    actionLoading: false,
                  });
                }
              }),
              catchError((err: HttpErrorResponse) => {
                const backendMsg = err.error?.message;

                const isInsufficient =
                  err.status === 400 &&
                  backendMsg === 'Insufficient funds in payment account';

                const displayMsg = isInsufficient
                  ? 'Insufficient funds in payment account'
                  : backendMsg || err.message || 'An unexpected error occurred';

                patchState(store, {
                  actionLoading: false,
                  alertMessage: displayMsg,
                  alertType: 'error',
                  error: displayMsg,
                });

                store._triggerAutoHide();

                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      verifyPrepayment: rxMethod<{ payload: any }>(
        pipe(
          tap(() => patchState(store, { actionLoading: true, error: null })),
          switchMap(({ payload }) =>
            loansService.verifyPrepayment(payload).pipe(
              tap(() => {
                patchState(store, {
                  activeChallengeId: null,
                  calculationResult: null,
                  actionLoading: false,
                });
                store.loadLoans();

                store.loadCounts();
              }),
              catchError((error) => {
                patchState(store, {
                  actionLoading: false,
                  error: error.message,
                });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      _listenToGlobalCreateSuccess: rxMethod<void>(
        pipe(
          switchMap(() =>
            actions$.pipe(
              ofType(LoansCreateActions.requestLoanSuccess),
              tap(() => store.loadLoans()),
            ),
          ),
        ),
      ),
    };
  }),

  withHooks({
    onInit(store) {
      store._listenToGlobalCreateSuccess();
    },
  }),
);
