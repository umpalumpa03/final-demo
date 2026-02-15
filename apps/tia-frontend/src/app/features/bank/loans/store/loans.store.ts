import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  patchState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { pipe, switchMap, tap, map, catchError, EMPTY, delay } from 'rxjs';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { toTitleCase } from '../shared/utils/titlecase.util';
import { LoansService } from '../shared/services/loans.service';
import { ErrorKeys, loansInitialState, SuccessKeys } from './loans.state';
import { ILoanDetails, LoanAlertType } from '../shared/models/loan.model';
import {
  PrepaymentCalculationPayload,
  IInitiatePrepaymentRequest,
} from '../shared/models/prepayment.model';
import { ILoanRequest } from '../shared/models/loan-request.model';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';

export const LoansStore = signalStore(
  { providedIn: 'root' },
  withState(loansInitialState),
  withComputed((store) => {
    const globalStore = inject(Store);
    const translate = inject(TranslateService);
    const accountsSignal = globalStore.selectSignal(selectAccounts);

    const loansWithAccountInfo = computed(() => {
      const currentAccounts = accountsSignal() || [];
      const areAccountsLoaded = currentAccounts.length > 0;

      return store.loans().map((loan) => {
        const matchedAccount = currentAccounts.find(
          (acc) => String(acc.id) === String(loan.accountId),
        );
        let accName = translate.instant('loans.dashboard.acc_loading');
        if (matchedAccount) {
          accName = matchedAccount.friendlyName || matchedAccount.name;
        } else if (areAccountsLoaded) {
          accName = translate.instant('loans.dashboard.unknown');
        }
        return { ...loan, accountName: accName };
      });
    });

    const accountFilteredLoans = computed(() => {
      const allLoans = loansWithAccountInfo();
      const accountId = store.filterAccountId();
      if (!accountId) return allLoans;
      return allLoans.filter((l) => String(l.accountId) === String(accountId));
    });

    return {
      loansWithAccountInfo,
      activeAccountName: computed(() => {
        const id = store.filterAccountId();
        if (!id) return null;

        const accounts = accountsSignal() || [];
        const account = accounts.find((a) => String(a.id) === String(id));

        return account
          ? account.friendlyName || account.name
          : 'Selected Account';
      }),

      loanCounts: computed(() => {
        const loans = accountFilteredLoans();
        return {
          all: loans.length,
          pending: loans.filter((l) => l.status === 1).length,
          approved: loans.filter((l) => l.status === 2).length,
          declined: loans.filter((l) => l.status === 3).length,
        };
      }),
      filteredLoans: computed(() => {
        let result = accountFilteredLoans();
        const status = store.filterStatus();
        const query = store.searchQuery().toLowerCase().trim();

        if (status !== null) {
          result = result.filter((l) => l.status === status);
        }
        if (query) {
          result = result.filter((l) => {
            const friendlyName = (l.friendlyName || '').toLowerCase();
            const purpose = (l.purpose || '').toLowerCase();
            const amount = String(l.loanAmount || '');
            return (
              friendlyName.includes(query) ||
              purpose.includes(query) ||
              amount.includes(query)
            );
          });
        }
        return result;
      }),
      loanMonthsOptions: computed(() =>
        (store.months() || []).map((m) => ({ label: `${m} Months`, value: m })),
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
        return message && type ? { message, type } : null;
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

  withMethods((store) => {
    const loansService = inject(LoansService);
    const alertService = inject(AlertService);
    const translate = inject(TranslateService);

    const handleLoadError = (err: HttpErrorResponse, key: string) => {
      const backendMsg = err?.error?.message || err?.message;
      const msg = backendMsg || translate.instant(key);

      patchState(store, {
        error: msg,
        loading: false,
        detailsLoading: false,
      });
      return EMPTY;
    };

    const handleActionError = (err: HttpErrorResponse, key: string) => {
      const backendMsg = err?.error?.message || err?.message;
      const msg = backendMsg || translate.instant(key);

      patchState(store, {
        loading: false,
        actionLoading: false,
        detailsLoading: false,
      });

      alertService.showAlert('error', msg);
      return EMPTY;
    };

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
      reset() {
        patchState(store, loansInitialState);
      },
      closeModals() {
        patchState(store, {
          isDetailsOpen: false,
          isPrepaymentOpen: false,
          selectedLoanDetails: null,
          activePrepaymentLoan: null,
        });
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

                patchState(store, {
                  loans: mappedLoans,
                  loading: false,
                });
              }),
              catchError((err) => handleLoadError(err, ErrorKeys.LOAD_LOANS)),
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
              catchError((err) =>
                handleActionError(err, ErrorKeys.LOAD_DETAILS),
              ),
            );
          }),
        ),
      ),

      loadMonths: rxMethod<{ forceRefresh?: boolean }>(
        pipe(
          switchMap(({ forceRefresh }) => {
            if (store.months().length > 0 && !forceRefresh) return EMPTY;
            return loansService.getLoanMonths().pipe(
              tap((months) => patchState(store, { months })),
              catchError((err) => handleActionError(err, ErrorKeys.MONTHS)),
            );
          }),
        ),
      ),

      loadPurposes: rxMethod<{ forceRefresh?: boolean }>(
        pipe(
          switchMap(({ forceRefresh }) => {
            if (store.purposes().length > 0 && !forceRefresh) return EMPTY;
            return loansService.getPurposes().pipe(
              tap((purposes) => patchState(store, { purposes, error: null })),
              catchError((err) => handleActionError(err, ErrorKeys.PURPOSES)),
            );
          }),
        ),
      ),

      loadPrepaymentOptions: rxMethod<{ forceRefresh?: boolean }>(
        pipe(
          switchMap(({ forceRefresh }) => {
            if (!forceRefresh && store.prepaymentOptions().length > 0)
              return EMPTY;
            return loansService.getPrepaymentOptions().pipe(
              tap((options) =>
                patchState(store, { prepaymentOptions: options, error: null }),
              ),
              catchError((err) => handleActionError(err, ErrorKeys.OPTIONS)),
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
              tap((result) =>
                patchState(store, {
                  calculationResult: result,
                  actionLoading: false,
                }),
              ),
              catchError((err) =>
                handleActionError(err, ErrorKeys.CALCULATION),
              ),
            );
          }),
        ),
      ),
    };
  }),

  withMethods((store) => {
    const loansService = inject(LoansService);
    const alertService = inject(AlertService);
    const translate = inject(TranslateService);

    const handleActionError = (err: HttpErrorResponse, key: string) => {
      const backendMsg = err?.error?.message || err?.message;
      const msg = backendMsg || translate.instant(key);
      patchState(store, { actionLoading: false });
      alertService.showAlert('error', msg);
      return EMPTY;
    };

    const handleActionSuccess = (key: string) => {
      const msg = translate.instant(key);

      patchState(store, {
        actionLoading: false,
        detailsLoading: false,
      });

      alertService.showAlert('success', msg);

      store._triggerAutoHide();
    };

    const showAlert = (message: string, alertType: LoanAlertType) => {
      patchState(store, { alertMessage: message, alertType });
      store._triggerAutoHide();
    };

    return {
      showAlert,

      openDetails(id: string) {
        store.loadLoanDetails(id);
        patchState(store, { isDetailsOpen: true, isPrepaymentOpen: false });
      },

      openPrepayment(loan: ILoanDetails) {
        patchState(store, {
          isDetailsOpen: false,
          isPrepaymentOpen: true,
          activePrepaymentLoan: loan,
        });
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
                  });
                  handleActionSuccess(SuccessKeys.OTP_SENT);
                }
              }),
              catchError((err) => {
                const backendMsg = err?.error?.message;
                if (
                  err.status === 400 &&
                  backendMsg?.includes('Insufficient funds')
                ) {
                  const msg = translate.instant(ErrorKeys.INSUFFICIENT_FUNDS);
                  patchState(store, { actionLoading: false });
                  alertService.showAlert('error', msg);
                  return EMPTY;
                }
                return handleActionError(err, ErrorKeys.INITIATE_PREPAYMENT);
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
              tap((response) => {
                if (response.success === false)
                  throw new Error(response.message || 'Invalid code');
                patchState(store, {
                  activeChallengeId: null,
                  calculationResult: null,
                  actionLoading: false,
                  loanDetailsCache: {},
                });
                handleActionSuccess(SuccessKeys.PAYMENT_COMPLETE);
                store.loadLoans({ forceChange: true });
              }),
              catchError((err) =>
                handleActionError(err, ErrorKeys.VERIFY_PREPAYMENT),
              ),
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
                handleActionSuccess(SuccessKeys.RENAME);
                patchState(store, { loans: updatedLoans });
              }),
              catchError((err) => handleActionError(err, ErrorKeys.RENAME)),
            ),
          ),
        ),
      ),

      requestLoan: rxMethod<ILoanRequest>(
        pipe(
          tap(() => patchState(store, { actionLoading: true, error: null })),
          switchMap((payload) =>
            loansService.requestLoan(payload).pipe(
              tap(() => {
                patchState(store, {
                  actionLoading: false,
                  loanDetailsCache: {},
                });
                handleActionSuccess(SuccessKeys.REQUEST);
                store.loadLoans({ forceChange: true });
              }),
              catchError((err) =>
                handleActionError(err, ErrorKeys.REQUEST_LOAN),
              ),
            ),
          ),
        ),
      ),
    };
  }),

  withMethods((store) => {
    return {
      navigateDetails(direction: number) {
        const currentDetails = store.selectedLoanDetails();
        const list = store.filteredLoans();
        if (!currentDetails || list.length === 0) return;

        const currentIndex = list.findIndex((l) => l.id === currentDetails.id);
        if (currentIndex === -1) return;

        let newIndex = currentIndex + direction;
        if (newIndex < 0) newIndex = list.length - 1;
        if (newIndex >= list.length) newIndex = 0;

        store.openDetails(list[newIndex].id);
      },
    };
  }),
);
