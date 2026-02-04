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
  of,
  pipe,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LoanManagementApiService } from '../shared/services/loan-management-api.service';
import { loanManagementInitialState } from './loan-management.state';
import {
  LOAN_APPROVAL_STATUS,
  UserInfo,
} from '../shared/models/loan-management.model';

/**
 * In-flight request cache for deduplication.
 * Prevents multiple concurrent requests for the same resource.
 */
const userInfoRequests = new Map<
  string,
  ReturnType<LoanManagementApiService['getUserInfo']>
>();

/**
 * Loan Management Signal Store
 *
 * Features:
 * - Caching: User info cached in Map
 * - Deduplication: shareReplay prevents duplicate concurrent requests
 * - Cancellation: switchMap cancels previous requests on selection change
 * - Optimistic updates: Approve/reject removes from list immediately
 */
export const LoanManagementStore = signalStore(
  withState(loanManagementInitialState),

  withComputed((store) => ({
    /**
     * Selected loan details from pending approvals list
     */
    selectedLoanDetails: computed(() => {
      const selectedId = store.selectedLoanId();
      if (!selectedId) return null;
      return store.pendingApprovals().find((loan) => loan.id === selectedId) ?? null;
    }),

    /**
     * Selected user info from cache (based on selected loan's userId)
     */
    selectedUserInfo: computed(() => {
      const selectedId = store.selectedLoanId();
      if (!selectedId) return null;
      const loan = store.pendingApprovals().find((l) => l.id === selectedId);
      if (!loan?.userId) return null;
      return store.userInfoCache()[loan.userId] ?? null;
    }),

    /**
     * Whether there are pending approvals
     */
    hasPendingApprovals: computed(() => store.pendingApprovals().length > 0),

    /**
     * Count of pending approvals
     */
    pendingCount: computed(() => store.pendingApprovals().length),
  })),

  withMethods((store) => {
    const api = inject(LoanManagementApiService);

    /**
     * Helper to fetch user info with caching and dedup
     */
    const fetchUserInfo = (userId: string | undefined) => {
      // Handle missing userId gracefully
      if (!userId) {
        patchState(store, { userInfoLoading: false });
        return EMPTY;
      }

      // Check cache first
      const cached = store.userInfoCache()[userId];
      if (cached) {
        patchState(store, { userInfoLoading: false });
        return of(cached);
      }

      // Dedup: reuse in-flight request if exists
      let request$ = userInfoRequests.get(userId);
      if (!request$) {
        request$ = api.getUserInfo(userId).pipe(shareReplay(1));
        userInfoRequests.set(userId, request$);
      }

      return request$.pipe(
        tap((userInfo: UserInfo) => {
          patchState(store, {
            userInfoCache: {
              ...store.userInfoCache(),
              [userId]: userInfo,
            },
            userInfoLoading: false,
          });
          userInfoRequests.delete(userId);
        }),
        catchError(() => {
          userInfoRequests.delete(userId);
          patchState(store, { userInfoLoading: false });
          return EMPTY;
        }),
      );
    };

    return {
      /**
       * Load pending approvals list.
       * Stale-while-revalidate: shows cached data immediately, refreshes in background.
       */
      loadPendingApprovals: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(() =>
            api.getPendingApprovals().pipe(
              tap((pendingApprovals) => {
                patchState(store, { pendingApprovals, loading: false });
              }),
              catchError((err: HttpErrorResponse) => {
                const errorMsg =
                  err.status === 403
                    ? 'Access denied. Support role required.'
                    : err.error?.message ||
                      err.message ||
                      'Failed to load pending approvals';
                patchState(store, { loading: false, error: errorMsg });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      /**
       * Select a loan and load its user info.
       * Uses switchMap to cancel previous in-flight requests.
       */
      selectLoan: rxMethod<string | null>(
        pipe(
          tap((loanId) => {
            patchState(store, {
              selectedLoanId: loanId,
              userInfoLoading: !!loanId,
              actionError: null,
            });
          }),
          filter((loanId): loanId is string => loanId !== null),
          switchMap((loanId) => {
            // Get userId from pending approvals
            const loan = store.pendingApprovals().find((l) => l.id === loanId);
            return fetchUserInfo(loan?.userId);
          }),
        ),
      ),

      /**
       * Load user info for a specific user.
       * Called on demand when loan case is opened.
       * NEVER call per row in the list.
       */
      loadUserInfo: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { userInfoLoading: true })),
          switchMap((userId) => fetchUserInfo(userId)),
        ),
      ),

      /**
       * Approve a loan.
       * Optimistically removes from list, invalidates caches on success.
       */
      approveLoan: rxMethod<string>(
        pipe(
          tap(() =>
            patchState(store, { actionLoading: true, actionError: null }),
          ),
          switchMap((loanId) => {
            // Get userId before optimistic update for cache invalidation
            const loan = store.pendingApprovals().find((l) => l.id === loanId);
            const userId = loan?.userId;

            // Optimistic update: remove from list immediately
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
                  // Invalidate user cache
                  const newUserInfoCache = { ...store.userInfoCache() };
                  if (userId) {
                    delete newUserInfoCache[userId];
                  }

                  patchState(store, {
                    actionLoading: false,
                    selectedLoanId: null,
                    userInfoCache: newUserInfoCache,
                  });
                }),
                catchError((err: HttpErrorResponse) => {
                  const errorMsg =
                    err.status === 404
                      ? 'Loan already processed by another user.'
                      : err.status === 403
                        ? 'Access denied. Support role required.'
                        : err.error?.message || 'Failed to approve loan';

                  patchState(store, {
                    actionLoading: false,
                    actionError: errorMsg,
                  });

                  // Reload list to get current state (rollback)
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

      /**
       * Reject a loan with reason.
       * Optimistically removes from list, invalidates caches on success.
       */
      rejectLoan: rxMethod<{ loanId: string; reason: string }>(
        pipe(
          tap(() =>
            patchState(store, { actionLoading: true, actionError: null }),
          ),
          switchMap(({ loanId, reason }) => {
            // Get userId before optimistic update for cache invalidation
            const loan = store.pendingApprovals().find((l) => l.id === loanId);
            const userId = loan?.userId;

            // Optimistic update: remove from list immediately
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
                  // Invalidate user cache
                  const newUserInfoCache = { ...store.userInfoCache() };
                  if (userId) {
                    delete newUserInfoCache[userId];
                  }

                  patchState(store, {
                    actionLoading: false,
                    selectedLoanId: null,
                    userInfoCache: newUserInfoCache,
                  });
                }),
                catchError((err: HttpErrorResponse) => {
                  const errorMsg =
                    err.status === 404
                      ? 'Loan already processed by another user.'
                      : err.status === 403
                        ? 'Access denied. Support role required.'
                        : err.error?.message || 'Failed to reject loan';

                  patchState(store, {
                    actionLoading: false,
                    actionError: errorMsg,
                  });

                  // Reload list to get current state (rollback)
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

      /**
       * Clear selection and close drawer
       */
      clearSelection(): void {
        patchState(store, {
          selectedLoanId: null,
          actionError: null,
        });
      },

      /**
       * Clear error state
       */
      clearError(): void {
        patchState(store, { error: null, actionError: null });
      },
    };
  }),
);
