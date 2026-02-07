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
import { HttpErrorResponse } from '@angular/common/http';
import { LoansCreateActions } from 'apps/tia-frontend/src/app/store/loans/loans.actions';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { toTitleCase } from '../shared/utils/titlecase.util';
import { LoansService } from '../shared/services/loans.service';
import { loansInitialState } from './loans.state';
import { ILoanDetails, LoanAlertType } from '../shared/models/loan.model';
import {
  PrepaymentCalculationPayload,
  IInitiatePrepaymentRequest,
  IVerifyPrepaymentResponse,
} from '../shared/models/prepayment.model';
import { PrepaymentCalculationResult } from '../shared/models/prepayment.model';

export const LoansStore = signalStore(
  withState(loansInitialState),

  withComputed((store) => {
    const globalStore = inject(Store);
    const accountsSignal = globalStore.selectSignal(selectAccounts);

    return {
      loansWithAccountInfo: computed(() => {
        const currentAccounts = accountsSignal() || [];
        const areAccountsLoaded = currentAccounts.length > 0;

        return store.loans().map((loan) => {
          const matchedAccount = currentAccounts.find(
            (acc) => String(acc.id) === String(loan.accountId),
          );
          let accName = 'Loading Account...';
          if (matchedAccount) {
            accName = matchedAccount.friendlyName || matchedAccount.name;
          } else if (areAccountsLoaded) {
            accName = `Unknown Account`;
          }

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

        if (message && type) {
          return {
            message,
            type: type,
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
      const query = store.searchQuery().toLowerCase().trim();
      const accountFilter = store.filterAccountId();
      const loans = store.loansWithAccountInfo();

      let result =
        status === null ? loans : loans.filter((l) => l.status === status);

      if (accountFilter) {
        result = result.filter((l) => l.accountId === accountFilter);
      }

      if (query) {
        result = result.filter((l) => {
          const friendlyName = (l.friendlyName || '').toLowerCase();
          const purpose = (l.purpose || '').toLowerCase();
          return friendlyName.includes(query) || purpose.includes(query);
        });
      }

      return result;
    }),
  })),

  withMethods((store) => {
    const loansService = inject(LoansService);

    return {
      setFilter(status: number | null) {
        patchState(store, { filterStatus: status });
      },
      setAccountFilter(accountId: string | null) {
        patchState(store, { filterAccountId: accountId });
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
      setSearchQuery(query: string) {
        patchState(store, { searchQuery: query });
      },

      _triggerAutoHide: rxMethod<void>(
        pipe(
          delay(3000),
          tap(() => patchState(store, { alertMessage: null, alertType: null })),
        ),
      ),

      loadLoans: rxMethod<{ status?: number | null; forceChange?: boolean }>(
        pipe(
          tap(({ status }) => {
            if (status !== undefined) {
              patchState(store, { filterStatus: status });
            }
          }),
          switchMap(({ forceChange }) => {
            const currentLoans = store.loans();

            if (currentLoans.length > 0 && !forceChange) {
              return EMPTY;
            }

            patchState(store, { loading: true, error: null });

            return loansService.getAllLoans().pipe(
              tap((loans) => {
                const mappedLoans = loans.map((l) => ({
                  ...l,
                  purpose: toTitleCase(l.purpose) || '',
                  friendlyName: toTitleCase(l.friendlyName),
                  accountName: l.accountName || '',
                }));

                const counts = {
                  all: loans.length,
                  approved: loans.filter((l) => l.status === 2).length,
                  pending: loans.filter((l) => l.status === 1).length,
                  declined: loans.filter((l) => l.status === 3).length,
                };

                patchState(store, {
                  loans: mappedLoans,
                  dashboardCounts: counts,
                  loading: false,
                });
              }),
              catchError((error) => {
                patchState(store, { error: error.message, loading: false });
                return EMPTY;
              }),
            );
          }),
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
          switchMap((id) => {
            const cachedDetails = store.loanDetailsCache()[id];

            if (cachedDetails) {
              patchState(store, {
                selectedLoanDetails: cachedDetails,
                detailsLoading: false,
              });
              return EMPTY;
            }

            return loansService.getLoanById(id).pipe(
              tap((details) =>
                patchState(store, (state) => ({
                  selectedLoanDetails: details,
                  detailsLoading: false,
                  loanDetailsCache: {
                    ...state.loanDetailsCache,
                    [id]: details,
                  },
                })),
              ),
              catchError((error) => {
                patchState(store, {
                  error: error.message,
                  detailsLoading: false,
                });
                return EMPTY;
              }),
            );
          }),
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

      loadMonths: rxMethod<{ forceRefresh?: boolean }>(
        pipe(
          switchMap(({ forceRefresh }) => {
            const currentMonths = store.months();
            if (currentMonths.length > 0 && !forceRefresh) {
              return EMPTY;
            }

            return loansService.getLoanMonths().pipe(
              tap((months) => patchState(store, { months })),
              catchError((error) => {
                patchState(store, { error: error.message });
                return EMPTY;
              }),
            );
          }),
        ),
      ),

      loadPurposes: rxMethod<{ forceRefresh?: boolean }>(
        pipe(
          switchMap(({ forceRefresh }) => {
            const currentPurposes = store.purposes();
            if (currentPurposes.length > 0 && !forceRefresh) {
              return EMPTY;
            }

            return loansService.getPurposes().pipe(
              tap((purposes) => patchState(store, { purposes, error: null })),
              catchError((error) => {
                patchState(store, { error: error.message });
                return EMPTY;
              }),
            );
          }),
        ),
      ),

      loadPrepaymentOptions: rxMethod<{ forceRefresh?: boolean }>(
        pipe(
          switchMap(({ forceRefresh }) => {
            const currentOptions = store.prepaymentOptions();

            if (!forceRefresh && currentOptions.length > 0) {
              return EMPTY;
            }

            return loansService.getPrepaymentOptions().pipe(
              tap((options) =>
                patchState(store, { prepaymentOptions: options, error: null }),
              ),
              catchError((error) => {
                patchState(store, { error: error.message });
                return EMPTY;
              }),
            );
          }),
        ),
      ),

      calculatePrepayment: rxMethod<{ payload: PrepaymentCalculationPayload }>(
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
              tap((result: PrepaymentCalculationResult) =>
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

      openDetails(id: string) {
        this.loadLoanDetails(id);
        patchState(store, { isDetailsOpen: true, isPrepaymentOpen: false });
      },

      openPrepayment(loan: ILoanDetails) {
        patchState(store, {
          isDetailsOpen: false,
          isPrepaymentOpen: true,
          activePrepaymentLoan: loan,
        });
      },

      closeModals() {
        patchState(store, {
          isDetailsOpen: false,
          isPrepaymentOpen: false,
          selectedLoanDetails: null,
          activePrepaymentLoan: null,
        });
      },

      navigateDetails(direction: number) {
        const currentDetails = store.selectedLoanDetails();
        const list = store.filteredLoans();

        if (!currentDetails || list.length === 0) return;

        const currentIndex = list.findIndex((l) => l.id === currentDetails.id);
        if (currentIndex === -1) return;

        let newIndex = currentIndex + direction;

        if (newIndex < 0) newIndex = list.length - 1;
        if (newIndex >= list.length) newIndex = 0;

        const nextLoan = list[newIndex];

        this.openDetails(nextLoan.id);
      },
    };
  }),

  withMethods((store) => {
    const loansService = inject(LoansService);
    const actions$ = inject(Actions);

    return {
      showAlert(message: string, alertType: LoanAlertType) {
        patchState(store, { alertMessage: message, alertType });
        store._triggerAutoHide();
      },

      initiatePrepayment: rxMethod<{ payload: IInitiatePrepaymentRequest }>(
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

      verifyPrepayment: rxMethod<{
        payload: { challengeId: string; code: string };
      }>(
        pipe(
          tap(() => patchState(store, { actionLoading: true, error: null })),
          switchMap(({ payload }) =>
            loansService.verifyPrepayment(payload).pipe(
              tap((response: IVerifyPrepaymentResponse) => {
                if (response.success === false) {
                  throw new Error(response.message || 'Invalid code');
                }

                patchState(store, {
                  activeChallengeId: null,
                  calculationResult: null,
                  actionLoading: false,
                  loanDetailsCache: {},
                });
                store.loadLoans({ forceChange: true });
              }),

              catchError((error) => {
                const errorMsg = error.message || 'Verification failed';

                patchState(store, {
                  actionLoading: false,
                  error: errorMsg,
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
              tap(() => store.loadLoans({ forceChange: true })),
            ),
          ),
        ),
      ),

      reset() {
        patchState(store, loansInitialState);
      },
    };
  }),

  withHooks({
    onInit(store) {
      store._listenToGlobalCreateSuccess();
    },
  }),
);
