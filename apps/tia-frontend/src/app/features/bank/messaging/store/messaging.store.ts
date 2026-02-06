import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { initialState, MailType, SendEmailRequest } from './messaging.state';
import { MessagingService } from '../services/messaging-api.service';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, forkJoin, of, pipe, switchMap, tap } from 'rxjs';
import { InboxService } from '@tia/shared/services/messages/inbox.service';
import { TranslateService } from '@ngx-translate/core';

export const MessagingStore = signalStore(
    withState(initialState),

    withMethods((store) => {
        const messagingService = inject(MessagingService);
        const translate = inject(TranslateService);
        return {
            getTotalCount: rxMethod<string>(
                pipe(
                    switchMap((type) => messagingService.getTotalCount(type).pipe(
                        tap((response) => {
                            patchState(store, { total: { ...store.total(), [type]: response.count } });
                        })
                    )),
                    catchError((error) => {
                        patchState(store, { error: translate.instant('storeErrors.loadTotalCount') });
                        return of(0);
                    })
                )
            ),

            getDraftTotalCount: rxMethod<number>(
                pipe(
                    switchMap(() => messagingService.getDraftTotalCount().pipe(
                        tap((response) => {
                            patchState(store, { draftsTotal: response.count });
                        }
                        )),
                    ),
                    catchError((error) => {
                        patchState(store, { error: translate.instant('storeErrors.loadDraftsTotalCount') });
                        return of(0);
                    })
                )
            ),

            getUnreadImportantCount: rxMethod<void>(
                pipe(
                    switchMap(() => messagingService.getImportantUnreadCount().pipe(
                        tap((response) => {
                            patchState(store, { importantCount: response.count });
                        }
                        )),
                    ),
                    catchError((error) => {
                        patchState(store, { error: translate.instant('messaging.storeErrors.loadImportantUnreadCount') });
                        return of();
                    }
                    ))
            ),

            togleFavorite: rxMethod<{ mailId: number; isFavorite: boolean }>(
                pipe(
                    tap(() => patchState(store, { isFavoriteLoading: true })),
                    switchMap(({ mailId, isFavorite }) =>
                        messagingService.togleFavorite(mailId, isFavorite).pipe(
                            tap(() => {
                                const currentDetail = store.emailDetail?.();
                                const isFavoritesPage = store.currentType() === 'favorites';

                                patchState(store, {
                                    mails: isFavoritesPage
                                        ? store.mails().filter(mail => mail.id !== mailId)
                                        : store.mails().map(mail =>
                                            mail.id === mailId ? { ...mail, isFavorite } : mail
                                        ),
                                    emailDetail: { ...currentDetail!, isFavorite },
                                    isFavoriteLoading: false
                                });
                            }),
                            catchError((error) => {
                                patchState(store, {
                                    error: translate.instant('messaging.storeErrors.toggleFavorite'),
                                    isFavoriteLoading: false
                                });
                                return of(null);
                            })
                        )
                    ),
                )
            ),
        };
    }),

    withMethods((store) => {
        const messagingService = inject(MessagingService);
        const inboxService = inject(InboxService);
        const translate = inject(TranslateService);

        const updateTotalCountByType = () => {
            const type = store.currentType();
            switch (type) {
                case 'drafts':
                    store.getDraftTotalCount(0);
                    break;
                case 'important':
                    store.getTotalCount('importants');
                    break;
                case 'favorites':
                    store.getTotalCount('favorite');
                    break;
                default:
                    store.getTotalCount(type);
            }
        };
        return {
            loadMails: rxMethod<MailType>(
                pipe(
                    tap((type) => {
                        patchState(store, {
                            isLoading: true,
                            error: null,
                            currentType: type,
                            mails: type !== store.currentType() ? [] : [...store.mails()],
                            pagination: type !== store.currentType() ?
                                { hasNextPage: false, nextCursor: null } :
                                { hasNextPage: store.pagination()?.hasNextPage ?? false, nextCursor: store.pagination()?.nextCursor ?? null },
                        });
                    }),
                    switchMap((type) =>
                        messagingService.getInbox(type, store.limit(), store?.pagination?.()?.nextCursor ?? null).pipe(
                            tap((response) => {
                                patchState(store, {
                                    mails: [...store.mails(), ...response.items],
                                    pagination: response.pagination,
                                    isLoading: false,
                                    error: null,
                                });
                            }),
                            catchError((error) => {
                                patchState(store, {
                                    isLoading: false,
                                    error: translate.instant('messaging.storeErrors.loadMails'),
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
                            store.getUnreadImportantCount();
                        }),
                        catchError((error) => {
                            patchState(store, {
                                error: translate.instant('messaging.storeErrors.markMailAsRead')
                            });
                            return of(null);
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
                            store.getUnreadImportantCount();
                            updateTotalCountByType();
                        }),
                        catchError((error) => {
                            patchState(store, {
                                error: translate.instant('messaging.storeErrors.deleteMail')
                            });
                            return of(null);
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
                                store.getUnreadImportantCount();
                                updateTotalCountByType();
                            }),
                            catchError((error) => {
                                patchState(store, {
                                    error: translate.instant('messaging.storeErrors.deleteAllMails')
                                });
                                return of(null);
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
                                store.getUnreadImportantCount();
                            }),
                            catchError((error) => {
                                patchState(store, {
                                    error: translate.instant('messaging.storeErrors.markAllAsRead')
                                });
                                return of(null);
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
                                    error: translate.instant('messaging.storeErrors.searchFailed'),
                                });
                                return of([]);
                            }),
                        );
                    }),
                ),
            ),

            getMailReplies: rxMethod<number>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap((mailId) => messagingService.getMailReplies(mailId).pipe(
                        tap((replies) => {
                            patchState(store, { mailReplies: replies }, { isLoading: false });
                        }),
                        catchError((error) => {
                            patchState(store, { isLoading: false, error: translate.instant('messaging.storeErrors.loadMailReplies') });
                            return of([]);
                        }),
                    ))
                )
            ),
        };
    }),
    withMethods((store) => {
        const messagingService = inject(MessagingService);
        const inboxService = inject(InboxService);
        const translate = inject(TranslateService);
        return {
            sendEmail: rxMethod<SendEmailRequest>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap((emailData) => messagingService.sendEmail(emailData).pipe(
                        tap(() => {
                            patchState(store, 
                                { mails: [], pagination: { hasNextPage: false, nextCursor: null } }, 
                                { isLoading: false, successMessage: translate.instant('messaging.storeSuccess.emailSent') });

                            store.loadMails(store.currentType());
                            inboxService.fetchInboxCount();
                            store.getUnreadImportantCount();
                            store.getDraftTotalCount(0);
                            switch (store.currentType()) {
                                case 'important':
                                    store.getTotalCount('importants');
                                    break;
                                default:
                                    store.getTotalCount(store.currentType());
                            }
                        }),
                        catchError((error) => {
                            patchState(store, {
                                isLoading: false,
                                error: translate.instant('messaging.storeErrors.sendEmail'),
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
                    tap(() => patchState(store, { isLoading: true, mailReplies: [] })),
                    switchMap((mailId) => messagingService.getEmailById(mailId).pipe(
                        tap((emailDetail) => {
                            patchState(store, { emailDetail }, { isLoading: false });
                        }),
                        catchError((error) => {
                            patchState(store, { isLoading: false, error: translate.instant('messaging.storeErrors.loadEmailDetail') });
                            return of(null);
                        }),
                    )),
                )
            ),

            sendDraft: rxMethod<{ mailId: number; data: SendEmailRequest }>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap(({ mailId, data }) => messagingService.sendDraft(mailId, data).pipe(
                        tap(() => {
                            patchState(store, { mails: [], pagination: { hasNextPage: false, nextCursor: null } },
                                { isLoading: false, successMessage: translate.instant('messaging.storeSuccess.draftSent') });
                            store.loadMails('drafts');
                            inboxService.fetchInboxCount();
                            store.getUnreadImportantCount();
                            store.getDraftTotalCount(0);
                        }),
                        catchError((error) => {
                            patchState(store, {
                                isLoading: false,
                                error: translate.instant('messaging.storeErrors.sendDraft'),
                            });
                            return of(null);
                        }),
                    )),
                )
            ),

            sendMailReply: rxMethod<{ mailId: number; body: string }>(
                pipe(
                    tap(() => patchState(store)),
                    switchMap(({ mailId, body }) => messagingService.sendMailReply(mailId, body).pipe(
                        tap(() => {
                            store.getMailReplies(mailId);
                            patchState(store, {
                                isLoading: false,
                                successMessage: translate.instant('messaging.storeSuccess.replySent')
                            });
                        }),
                        catchError((error) => {
                            patchState(store, { isLoading: false, error: translate.instant('messaging.storeErrors.sendMailReply') });
                            return of(null);
                        }),
                    ))
                )
            ),
        };
    }
    ),
);