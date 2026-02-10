import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { initialState, MailType, SendEmailRequest } from './messaging.state';
import { MessagingService } from '../services/messaging-api.service';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, forkJoin, of, pipe, switchMap, tap } from 'rxjs';
import { InboxService } from '@tia/shared/services/messages/inbox.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@tia/core/services/alert/alert.service';

export const MessagingStore = signalStore(
    withState(initialState),

    withMethods((store) => {
        const messagingService = inject(MessagingService);
        const translate = inject(TranslateService);
        const alertService = inject(AlertService);
        return {
            getTotalCount: rxMethod<string>(
                pipe(
                    switchMap((type) => messagingService.getTotalCount(type).pipe(
                        tap((response) => {
                            patchState(store, { total: { ...store.total(), [type]: response.count } });
                        })
                    )),
                    catchError(() => {
                        alertService.error(translate.instant('storeErrors.loadTotalCount'),
                            { variant: 'dismissible', title: 'Oops!' });
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
                    catchError(() => {
                        alertService.error(translate.instant('storeErrors.loadDraftsTotalCount'), { variant: 'dismissible', title: 'Oops!' });
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
                    catchError(() => {
                        alertService.error(translate.instant('messaging.storeErrors.loadImportantUnreadCount'), { variant: 'dismissible', title: 'Oops!' });
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
                            catchError(() => {
                                patchState(store, { isFavoriteLoading: false });
                                alertService.error(translate.instant('messaging.storeErrors.toggleFavorite'), { variant: 'dismissible', title: 'Oops!' });
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
        const alertService = inject(AlertService);

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
                                const existingMails = store.mails();
                                const existingIds = new Set(existingMails.map(m => m.id));
                                const newMails = response.items.filter(item => !existingIds.has(item.id));

                                patchState(store, {
                                    mails: [...existingMails, ...newMails],
                                    pagination: response.pagination,
                                    isLoading: false,
                                });
                                inboxService.fetchInboxCount();
                                store.getUnreadImportantCount();
                            }),
                            catchError(() => {
                                patchState(store, { isLoading: false });
                                alertService.error(translate.instant('messaging.storeErrors.loadMails'), { variant: 'dismissible', title: 'Oops!' });
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
                        catchError(() => {
                            alertService.error(translate.instant('messaging.storeErrors.markMailAsRead'), { variant: 'dismissible', title: 'Oops!' });
                            return of(null);
                        })
                    ))
                )
            ),

            deleteMail: rxMethod<number>(
                pipe(
                    tap(() => patchState(store, { isDeleting: true })),
                    switchMap((mailId) => messagingService.deleteMail(mailId).pipe(
                        tap(() => {
                            patchState(store, {
                                mails: store.mails().filter(mail => mail.id !== mailId),
                                isDeleting: false
                            });
                            inboxService.fetchInboxCount();
                            store.getUnreadImportantCount();
                            updateTotalCountByType();
                        }),
                        catchError(() => {
                            patchState(store, { isDeleting: false });
                            alertService.error(translate.instant('messaging.storeErrors.deleteMail'), { variant: 'dismissible', title: 'Oops!' });
                            return of(null);
                        })
                    ))
                )
            ),

            deleteAllMails: rxMethod<number[]>(
                pipe(
                     tap(() => patchState(store, { isDeleting: true })),
                    switchMap((ids) => {
                        const deleteObservables = ids.map(id => messagingService.deleteMail(id));
                        return forkJoin(deleteObservables).pipe(
                            tap(() => {
                                patchState(store, {
                                    mails: store.mails().filter(mail => !ids.includes(mail.id)),
                                    isDeleting: false
                                });
                                inboxService.fetchInboxCount();
                                store.getUnreadImportantCount();
                                updateTotalCountByType();
                            }),
                            catchError(() => {
                                patchState(store, { isDeleting: false });
                                alertService.error(translate.instant('messaging.storeErrors.deleteAllMails'), { variant: 'dismissible', title: 'Oops!' });
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
                            catchError(() => {
                                alertService.error(translate.instant('messaging.storeErrors.markAllAsRead'), { variant: 'dismissible', title: 'Oops!' });
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
                            catchError(() => {
                                patchState(store, {
                                    searchResults: [],
                                    isSearching: false,
                                });
                                alertService.error(translate.instant('messaging.storeErrors.searchFailed'), { variant: 'dismissible', title: 'Oops!' });
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
                        catchError(() => {
                            patchState(store, { isLoading: false });
                            alertService.error(translate.instant('messaging.storeErrors.loadMailReplies'), { variant: 'dismissible', title: 'Oops!' });
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
        const alertService = inject(AlertService);
        return {
            sendEmail: rxMethod<SendEmailRequest>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap((emailData) => messagingService.sendEmail(emailData).pipe(
                        tap(() => {
                            patchState(store,
                                { mails: [], pagination: { hasNextPage: false, nextCursor: null } },
                                { isLoading: false });
                            alertService.success(translate.instant('messaging.storeSuccess.emailSent'),
                                { variant: 'dismissible',title: 'Success!'});

                            store.loadMails(store.currentType());
                            inboxService.fetchInboxCount();
                            store.getUnreadImportantCount();
                            store.getDraftTotalCount(0);
                            switch (store.currentType()) {
                                case 'drafts':
                                    break;
                                case 'important':
                                    store.getTotalCount('importants');
                                    break;
                                case 'favorites':
                                    store.getTotalCount('favorite');
                                    break;
                                default:
                                    store.getTotalCount(store.currentType());
                            }
                        }),
                        catchError(() => {
                            patchState(store, { isLoading: false });
                            alertService.error(translate.instant('messaging.storeErrors.sendEmail'), { variant: 'dismissible', title: 'Oops!' });
                            return of(null);
                        }),
                    )
                    ),
                )
            ),

            getEmailById: rxMethod<number>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, mailReplies: [] })),
                    switchMap((mailId) => messagingService.getEmailById(mailId).pipe(
                        tap((emailDetail) => {
                            patchState(store, { emailDetail }, { isLoading: false });
                        }),
                        catchError(() => {
                            patchState(store, { isLoading: false });
                            alertService.error(translate.instant('messaging.storeErrors.loadEmailDetail'), { variant: 'dismissible', title: 'Oops!' });
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
                                { isLoading: false });
                            alertService.success(translate.instant('messaging.storeSuccess.draftSent'), { variant: 'dismissible', title: 'Success!' });
                            store.loadMails('drafts');
                            inboxService.fetchInboxCount();
                            store.getUnreadImportantCount();
                            store.getDraftTotalCount(0);
                        }),
                        catchError(() => {
                            patchState(store, { isLoading: false });
                            alertService.error(translate.instant('messaging.storeErrors.sendDraft'), { variant: 'dismissible', title: 'Oops!' });
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
                            patchState(store, { isLoading: false });
                            alertService.success(translate.instant('messaging.storeSuccess.replySent'), { variant: 'dismissible', title: 'Success!' });
                        }),
                        catchError(() => {
                            patchState(store, { isLoading: false });
                            alertService.error(translate.instant('messaging.storeErrors.sendMailReply'), { variant: 'dismissible', title: 'Oops!' });
                            return of(null);
                        }),
                    ))
                )
            ),
        };
    }
    ),
);