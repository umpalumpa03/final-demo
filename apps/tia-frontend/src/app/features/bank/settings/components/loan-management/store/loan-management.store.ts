import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  catchError,
  EMPTY,
  filter,
  forkJoin,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { LoanManagementApiService } from '../shared/services/loan-management-api.service';
import {
  loanManagementInitialState,
  LoanSuccessKeys,
  LoanErrorKeys,
} from './loan-management.state';
import {
  LOAN_APPROVAL_STATUS,
  LoanDetailsResponse,
  UserInfo,
} from '../shared/models/loan-management.model';

export const LoanManagementStore = signalStore(
  withState(loanManagementInitialState),

  withComputed((store) => ({
    selectedLoanDetails: computed(() => {
      const selectedId = store.selectedLoanId();
      if (!selectedId) return null;
      return store.pendingApprovals().find((loan) => loan.id === selectedId) ?? null;
    }),
    selectedUserInfo: computed(() => {
      const selectedId = store.selectedLoanId();
      if (!selectedId) return null;
      const loan = store.pendingApprovals().find((l) => l.id === selectedId);
      if (!loan?.userId) return null;
      return store.userInfoCache()[loan.userId] ?? null;
    }),
    selectedLoanDetailsResponse: computed(() => {
      const selectedId = store.selectedLoanId();
      if (!selectedId) return null;
      return store.loanDetailsCache()[selectedId] ?? null;
    }),
    sortedPendingApprovals: computed(() =>
      [...store.pendingApprovals()].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    ),
    hasPendingApprovals: computed(() => store.pendingApprovals().length > 0),
    pendingCount: computed(() => store.pendingApprovals().length),
    shouldLoadInitialData: computed(() => 
      !store.hasInitialLoad() && !store.loading()
    ),
  })),

  withMethods((store) => {
    const api = inject(LoanManagementApiService);
    const translate = inject(TranslateService);

    const fetchUserInfo = (userId: string | undefined) => {
      if (!userId) {
        patchState(store, { userInfoLoading: false });
        return EMPTY;
      }

      return api.getUserInfo(userId).pipe(
        tap((userInfo: UserInfo) => {
          patchState(store, {
            userInfoCache: {
              ...store.userInfoCache(),
              [userId]: userInfo,
            },
            userInfoLoading: false,
          });
        }),
        catchError(() => {
          patchState(store, { userInfoLoading: false });
          return EMPTY;
        }),
      );
    };

    const fetchLoanDetails = (loanId: string) => {
      return api.getLoanDetails(loanId).pipe(
        tap((loanDetails: LoanDetailsResponse) => {
          patchState(store, {
            loanDetailsCache: {
              ...store.loanDetailsCache(),
              [loanId]: loanDetails,
            },
            loanDetailsLoading: false,
          });
        }),
        catchError(() => {
          patchState(store, { loanDetailsLoading: false });
          return EMPTY;
        }),
      );
    };

    return {
      loadPendingApprovals: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(() =>
            api.getPendingApprovals().pipe(
              tap((pendingApprovals) => {
                patchState(store, { pendingApprovals, loading: false, hasInitialLoad: true });
              }),
              catchError((err: HttpErrorResponse) => {
                const errorMsg =
                  err.status === 403
                    ? translate.instant(LoanErrorKeys.ACCESS_DENIED)
                    : err.error?.message ||
                      err.message ||
                      translate.instant(LoanErrorKeys.LOAD_PENDING);
                patchState(store, { loading: false, error: errorMsg });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      selectLoan: rxMethod<string | null>(
        pipe(
          tap((loanId) => {
            patchState(store, {
              selectedLoanId: loanId,
              userInfoLoading: !!loanId,
              loanDetailsLoading: !!loanId,
              actionError: null,
            });
          }),
          filter((loanId): loanId is string => loanId !== null),
          switchMap((loanId) => {
            const loan = store.pendingApprovals().find((l) => l.id === loanId);
            return forkJoin([
              fetchUserInfo(loan?.userId),
              fetchLoanDetails(loanId),
            ]);
          }),
        ),
      ),

      loadUserInfo: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { userInfoLoading: true })),
          switchMap((userId) => fetchUserInfo(userId)),
        ),
      ),

      approveLoan: rxMethod<string>(
        pipe(
          tap(() =>
            patchState(store, { actionLoading: true, actionError: null, successMessage: null }),
          ),
          switchMap((loanId) => {
            const loan = store.pendingApprovals().find((l) => l.id === loanId);
            const userId = loan?.userId;
            const updatedList = store
              .pendingApprovals()
              .filter((l) => l.id !== loanId);
            patchState(store, { pendingApprovals: updatedList });

            return api
              .approveLoan({
                loanId,
                status: LOAN_APPROVAL_STATUS.APPROVED,
              })
              .pipe(
                tap(() => {
                  const newUserInfoCache = { ...store.userInfoCache() };
                  const newLoanDetailsCache = { ...store.loanDetailsCache() };
                  if (userId) {
                    delete newUserInfoCache[userId];
                  }
                  delete newLoanDetailsCache[loanId];

                  patchState(store, {
                    actionLoading: false,
                    selectedLoanId: null,
                    userInfoCache: newUserInfoCache,
                    loanDetailsCache: newLoanDetailsCache,
                    successMessage: translate.instant(LoanSuccessKeys.APPROVED),
                  });
                }),
                catchError((err: HttpErrorResponse) => {
                  const errorMsg =
                    err.status === 404
                      ? translate.instant(LoanErrorKeys.ALREADY_PROCESSED)
                      : err.status === 403
                        ? translate.instant(LoanErrorKeys.ACCESS_DENIED)
                        : err.error?.message || translate.instant(LoanErrorKeys.APPROVE_LOAN);

                  patchState(store, {
                    actionLoading: false,
                    actionError: errorMsg,
                  });
                  return api.getPendingApprovals().pipe(
                    tap((pendingApprovals) => {
                      patchState(store, { pendingApprovals });
                    }),
                    catchError(() => EMPTY),
                  );
                }),
              );
          }),
        ),
      ),

      rejectLoan: rxMethod<{ loanId: string; reason: string }>(
        pipe(
          tap(() =>
            patchState(store, { actionLoading: true, actionError: null, successMessage: null }),
          ),
          switchMap(({ loanId, reason }) => {
            const loan = store.pendingApprovals().find((l) => l.id === loanId);
            const userId = loan?.userId;
            const updatedList = store
              .pendingApprovals()
              .filter((l) => l.id !== loanId);
            patchState(store, { pendingApprovals: updatedList });

            return api
              .approveLoan({
                loanId,
                status: LOAN_APPROVAL_STATUS.REJECTED,
                rejectionReason: reason,
              })
              .pipe(
                tap(() => {
                  const newUserInfoCache = { ...store.userInfoCache() };
                  const newLoanDetailsCache = { ...store.loanDetailsCache() };
                  if (userId) {
                    delete newUserInfoCache[userId];
                  }
                  delete newLoanDetailsCache[loanId];

                  patchState(store, {
                    actionLoading: false,
                    selectedLoanId: null,
                    userInfoCache: newUserInfoCache,
                    loanDetailsCache: newLoanDetailsCache,
                    successMessage: translate.instant(LoanSuccessKeys.REJECTED),
                  });
                }),
                catchError((err: HttpErrorResponse) => {
                  const errorMsg =
                    err.status === 404
                      ? translate.instant(LoanErrorKeys.ALREADY_PROCESSED)
                      : err.status === 403
                        ? translate.instant(LoanErrorKeys.ACCESS_DENIED)
                        : err.error?.message || translate.instant(LoanErrorKeys.REJECT_LOAN);

                  patchState(store, {
                    actionLoading: false,
                    actionError: errorMsg,
                  });
                  return api.getPendingApprovals().pipe(
                    tap((pendingApprovals) => {
                      patchState(store, { pendingApprovals });
                    }),
                    catchError(() => EMPTY),
                  );
                }),
              );
          }),
        ),
      ),
      clearSelection(): void {
        patchState(store, {
          selectedLoanId: null,
          actionError: null,
        });
      },
      clearError(): void {
        patchState(store, { error: null, actionError: null });
      },
      clearSuccessMessage(): void {
        patchState(store, { successMessage: null });
      },
    };
  }),
);
