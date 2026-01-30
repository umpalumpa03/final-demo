import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { initialState, MailType } from './messaging.state';
import { MessagingService } from '../services/messaging-api.service';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, forkJoin, of, pipe, switchMap, tap } from 'rxjs';
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
                    switchMap((mailId) => messagingService.markAsRead(mailId).pipe(
                        tap(() => {
                            patchState(store, {
                                mails: store.mails().map(mail =>
                                    mail.id === mailId ? { ...mail, isRead: true } : mail
                                )
                            });
                            inboxService.fetchInboxCount();
                        })
                    ))
                )
            ),

            deleteMail: rxMethod<number>(
                pipe(
                    switchMap((mailId) => messagingService.deleteMail(mailId).pipe(
                        tap(() => {
                            patchState(store, {
                                mails: store.mails().filter(mail => mail.id !== mailId)
                            });
                            inboxService.fetchInboxCount();
                        })
                    ))
                )
            ),

            deleteAllMails: rxMethod<number[]>(
                pipe(
                    switchMap((ids) => {
                        const deleteObservables = ids.map(id => messagingService.deleteMail(id));
                        return forkJoin(deleteObservables).pipe(
                            tap(() => {
                                patchState(store, {
                                    mails: store.mails().filter(mail => !ids.includes(mail.id))
                                });
                                inboxService.fetchInboxCount();
                            })
                        );
                    })
                )
            ),

            markAllAsRead: rxMethod<number[]>(
                pipe(
                    switchMap((ids) => {
                        const markReadObservables = store.mails()
                            .filter(mail => ids.includes(mail.id) && !mail.isRead)
                            .map(mail => messagingService.markAsRead(mail.id));
                        return forkJoin(markReadObservables).pipe(
                            tap(() => {
                                patchState(store, {
                                    mails: store.mails().map(mail =>
                                        ids.includes(mail.id) ? { ...mail, isRead: true } : mail
                                    )
                                });
                                inboxService.fetchInboxCount();
                            })
                        );
                    })
                )
            ),
        };
    })

);
