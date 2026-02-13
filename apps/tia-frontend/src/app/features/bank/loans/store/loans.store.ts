import { computed, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { EMPTY, pipe, switchMap, tap, catchError, map } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { toTitleCase } from '../shared/utils/titlecase.util';
import { LoansService } from '../shared/services/loans.service';
import { AlertService } from '@tia/shared/services/settings-language/alert.service';

import { ILoanDetails } from '../shared/models/loan.model';
import { ILoanRequest } from '../shared/models/loan-request.model';
import {
  PrepaymentCalculationPayload,
  IInitiatePrepaymentRequest,
} from '../shared/models/prepayment.model';
import { ErrorKeys, loansInitialState, SuccessKeys } from './loans.state';

export const LoansStore = signalStore(
  withState(loansInitialState),

  withComputed((store) => {
    const globalStore = inject(Store);
    const accountsSignal = globalStore.selectSignal(selectAccounts);
    const translate = inject(TranslateService);
    const alertService = inject(AlertService);

    const accountMap = computed(() => {
      const accounts = accountsSignal() || [];
      const map = new Map<string, string>();
      accounts.forEach((acc) => {
        map.set(String(acc.id), acc.friendlyName || acc.name);
      });
      return { map, hasLoaded: accounts.length > 0 };
    });

    const loansWithAccountInfo = computed(() => {
      const { map, hasLoaded } = accountMap();
      return store.loans().map((loan) => {
        const accId = String(loan.accountId);
        let accName = translate.instant('loans.dashboard.acc_loading');
        if (map.has(accId)) {
          accName = map.get(accId)!;
        } else if (hasLoaded) {
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
      alert: computed(() => {
        const type = alertService.alertType();
        const message = alertService.alertMessage();
        return type && message ? { type, message } : null;
      }),
      activeAccountName: computed(() => {
        const id = store.filterAccountId();
        if (!id) return null;
        const { map } = accountMap();
        return map.get(String(id)) || 'Selected Account';
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

    const handleError = (err: HttpErrorResponse, key: string) => {
      const msg = err.error?.message || err.message || translate.instant(key);
      patchState(store, {
        error: msg,
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
      setSearchQuery(query: string) {
        patchState(store, { searchQuery: query });
      },
      clearLoanDetails() {
        patchState(store, { selectedLoanDetails: null, detailsLoading: false });
      },
      clearCalculationResult() {
        patchState(store, { calculationResult: null, activeChallengeId: null });
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

      requestLoan: rxMethod<ILoanRequest>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((request) =>
            loansService.requestLoan(request).pipe(
              tap((newLoan) => {
                const formattedLoan = {
                  ...newLoan,
                  purpose: toTitleCase(newLoan.purpose) || '',
                  friendlyName: toTitleCase(newLoan.friendlyName),
                  accountName: '',
                };
                patchState(store, {
                  loading: false,
                  loans: [formattedLoan, ...store.loans()],
                });
                alertService.showAlert(
                  'success',
                  translate.instant(SuccessKeys.REQUEST),
                );
              }),
              catchError((error: HttpErrorResponse) =>
                handleError(error, ErrorKeys.REQUEST_LOAN),
              ),
            ),
          ),
        ),
      ),

      loadLoans: rxMethod<{ status?: number | null; forceChange?: boolean }>(
        pipe(
          tap(({ status }) => {
            if (status !== undefined)
              patchState(store, { filterStatus: status });
          }),
          switchMap(({ forceChange }) => {
            if (store.loans().length > 0 && !forceChange) return EMPTY;
            patchState(store, { loading: true, error: null });
            return loansService.getAllLoans().pipe(
              tap((loans) => {
                const mappedLoans = loans.map((l) => ({
                  ...l,
                  purpose: toTitleCase(l.purpose) || '',
                  friendlyName: toTitleCase(l.friendlyName),
                }));
                patchState(store, { loans: mappedLoans, loading: false });
              }),
              catchError((err: HttpErrorResponse) =>
                handleError(err, ErrorKeys.LOAD_LOANS),
              ),
            );
          }),
        ),
      ),

      loadLoanDetails: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { detailsLoading: true, error: null })),
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
              catchError((err: HttpErrorResponse) =>
                handleError(err, ErrorKeys.LOAD_DETAILS),
              ),
            );
          }),
        ),
      ),

      renameLoan: rxMethod<{ id: string; name: string }>(
        pipe(
          switchMap(({ id, name }) =>
            loansService.updateFriendlyName(id, name).pipe(
              tap(() => {
                patchState(store, (state) => ({
                  loans: state.loans.map((l) =>
                    l.id === id ? { ...l, friendlyName: name } : l,
                  ),
                }));
                alertService.showAlert(
                  'success',
                  translate.instant(ErrorKeys.RENAME),
                );
              }),
              catchError((err: HttpErrorResponse) =>
                handleError(err, ErrorKeys.RENAME),
              ),
            ),
          ),
        ),
      ),

      loadMonths: rxMethod<{ forceRefresh?: boolean }>(
        pipe(
          switchMap(({ forceRefresh }) => {
            if (store.months().length > 0 && !forceRefresh) return EMPTY;
            return loansService.getLoanMonths().pipe(
              tap((months) => patchState(store, { months })),
              catchError((e: HttpErrorResponse) =>
                handleError(e, ErrorKeys.MONTHS),
              ),
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
              catchError((e: HttpErrorResponse) =>
                handleError(e, ErrorKeys.PURPOSES),
              ),
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
              catchError((e: HttpErrorResponse) =>
                handleError(e, ErrorKeys.OPTIONS),
              ),
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
              catchError((err: HttpErrorResponse) =>
                handleError(err, ErrorKeys.CALCULATION),
              ),
            );
          }),
        ),
      ),

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
                  alertService.showAlert(
                    'success',
                    translate.instant(SuccessKeys.OTP_SENT),
                  );
                } else {
                  patchState(store, {
                    error: 'Challenge missing',
                    actionLoading: false,
                  });
                }
              }),
              catchError((err: HttpErrorResponse) => {
                const backendMsg = err.error?.message;
                if (
                  err.status === 400 &&
                  backendMsg === 'Insufficient funds in payment account'
                ) {
                  const msg = translate.instant(ErrorKeys.INSUFFICIENT_FUNDS);
                  patchState(store, { actionLoading: false, error: msg });
                  alertService.showAlert('error', msg);
                  return EMPTY;
                }
                return handleError(err, ErrorKeys.INITIATE_PREPAYMENT);
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
                if (response.success === false) {
                  throw new Error(
                    response.message ||
                      translate.instant(ErrorKeys.INVALID_CODE),
                  );
                }
                patchState(store, {
                  activeChallengeId: null,
                  calculationResult: null,
                  actionLoading: false,
                  loanDetailsCache: {},
                });
                alertService.showAlert(
                  'success',
                  translate.instant(ErrorKeys.PAYMENT_COMPLETE),
                );
              }),
              catchError((error: any) => {
                const msg =
                  error instanceof HttpErrorResponse
                    ? error.error?.message || error.message
                    : error.message;
                const displayMsg =
                  msg || translate.instant(ErrorKeys.VERIFY_PREPAYMENT);
                patchState(store, { actionLoading: false, error: displayMsg });
                alertService.showAlert('error', displayMsg);
                return EMPTY;
              }),
            ),
          ),
        ),
      ),
    };
  }),

  withMethods((store) => {
    return {
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
