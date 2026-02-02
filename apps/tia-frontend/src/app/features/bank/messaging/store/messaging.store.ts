import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { initialState, MailType, SendEmailRequest } from './messaging.state';
import { MessagingService } from '../services/messaging-api.service';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, forkJoin, of, pipe, switchMap, tap } from 'rxjs';
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
                                    error: 'Failed to load mails',
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

            searchMails: rxMethod<string>(
                pipe(
                    tap(() => patchState(store, { isSearching: true })),
                    debounceTime(300),
                    distinctUntilChanged(),
                    switchMap((query) => {
                        if (!query || query.trim().length < 1) {
                            patchState(store, {
                                searchResults: [],
                                isSearching: false
                            });
                            return of([]);
                        }

                        return messagingService.searchByEmail(query).pipe(
                            tap((users) => {
                                patchState(store, {
                                    searchResults: users,
                                    isSearching: false,
                                });
                            }),
                            catchError((error) => {
                                patchState(store, {
                                    searchResults: [],
                                    isSearching: false,
                                    error: 'Search failed',
                                });
                                return of([]);
                            }),
                        );
                    }),
                ),
            ),
        };
    }),
    withMethods((store) => {
        const messagingService = inject(MessagingService);
        const inboxService = inject(InboxService);
        return {
            sendEmail: rxMethod<SendEmailRequest>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap((emailData) => messagingService.sendEmail(emailData).pipe(
                        tap(() => {
                            patchState(store, { isLoading: false, successMessage: 'Email sent successfully' });
                            store.loadMails(store.currentType());
                            inboxService.fetchInboxCount();
                        }),
                        catchError((error) => {
                            patchState(store, {
                                isLoading: false,
                                error: 'Failed to send email',
                            });
                            return of(null);
                        }),
                    )
                    ),
                )
            ),

            clearSuccessMessage() {
                patchState(store, { successMessage: '' });
            },
            clearError() {
                patchState(store, { error: undefined });
            },

            getEmailById: rxMethod<number>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap((mailId) => messagingService.getEmailById(mailId).pipe(
                        tap((emailDetail) => {
                            patchState(store, { emailDetail }, { isLoading: false });
                        }),
                        catchError((error) => {
                            patchState(store, { error: 'Failed to load email detail' });
                            return of(null);
                        }),
                    )),
                )
            ),
        }
    })
);