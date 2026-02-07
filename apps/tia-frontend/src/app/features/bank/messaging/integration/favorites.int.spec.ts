import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../environments/environment';
import {
  TestContext,
  setupMessagingTest,
  cleanupMessagingTest,
  mockMails,
} from './messaging.test-helpers';

describe('Messaging Integration - Toggle Favorite Flow', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupMessagingTest();
  });

  afterEach(() => {
    cleanupMessagingTest(ctx.httpMock);
  });

  it('should toggle favorite on a mail', async () => {
    const mailsWithFavorite = [{ ...mockMails[0], isFavorite: false }];

    ctx.store.loadMails('inbox');

    const loadReq = ctx.httpMock.expectOne((request) =>
      request.url.includes('/mails')
    );
    loadReq.flush({
      items: mailsWithFavorite,
      pagination: { hasNextPage: false, nextCursor: null },
    });

    const importantReq1 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/importants/unread`);
    importantReq1.flush({ count: 0 });

    await vi.waitFor(() => {
      expect(ctx.store.mails()[0].isFavorite).toBe(false);
    });

    ctx.store.togleFavorite({ mailId: 1, isFavorite: true });

    const favoriteReq = ctx.httpMock.expectOne(
      `${environment.apiUrl}/mails/mark-as-favorite`
    );
    expect(favoriteReq.request.method).toBe('PUT');
    expect(favoriteReq.request.body).toEqual({ id: 1, isFavorite: true });

    favoriteReq.flush(null);

    await vi.waitFor(() => {
      expect(ctx.store.mails()[0].isFavorite).toBe(true);
      expect(ctx.store.isFavoriteLoading?.()).toBe(false);
    });
  });

  it('should remove mail from favorites page when unfavorited', async () => {
    const favoriteMail = { ...mockMails[0], isFavorite: true };

    ctx.store.loadMails('favorites');

    const loadReq = ctx.httpMock.expectOne((request) =>
      request.url.includes('/mails')
    );
    loadReq.flush({
      items: [favoriteMail],
      pagination: { hasNextPage: false, nextCursor: null },
    });

    const importantReq = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/importants/unread`);
    importantReq.flush({ count: 0 });

    await vi.waitFor(() => {
      expect(ctx.store.mails().length).toBe(1);
    });

    ctx.store.togleFavorite({ mailId: 1, isFavorite: false });

    const favoriteReq = ctx.httpMock.expectOne(
      `${environment.apiUrl}/mails/mark-as-favorite`
    );
    favoriteReq.flush(null);

    await vi.waitFor(() => {
      expect(ctx.store.mails().length).toBe(0);
    });
  });
});
