import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { initialState, MailType } from './messaging.state';
import { MessagingService } from '../services/messaging-api.service';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { InboxService } from '@tia/shared/services/messages/inbox.service';

export const MessagingStore = signalStore(
  withState(initialState),
  withMethods((store) => {
    const messagingService = inject(MessagingService);
    const inboxService = inject(InboxService);
    return {
      loadMails: rxMethod<MailType>(
        pipe(
          tap((type) => {
            patchState(store, {
              isLoading: true,
              error: null,
              currentType: type,
              mails: [],
              pagination: { hasNextPage: false, nextCursor: null },
            });
          }),
          switchMap((type) =>
            messagingService.getInbox(type, store.limit()).pipe(
              tap((response) => {
                patchState(store, {
                  mails: response.items,
                  pagination: response.pagination,
                  isLoading: false,
                  error: null,
                });
              }),
              catchError((error) => {
                patchState(store, {
                  isLoading: false,
                  error: error.message || 'Failed to load mails',
                });
                return of(null);
              }),
            ),
          ),
        ),
      ),

      markMailasRead: rxMethod<number>(
        pipe(
          switchMap((mailId) =>
            messagingService.markAsRead(mailId).pipe(
              tap(() => {
                patchState(store, {
                  mails: store
                    .mails()
                    .map((mail) =>
                      mail.id === mailId ? { ...mail, isRead: true } : mail,
                    ),
                });
                inboxService.fetchInboxCount();
              }),
            ),
          ),
        ),
      ),
    };
  }),
);
