import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  TestContext,
  setupMessagingTest,
  cleanupMessagingTest,
  mockUsers,
} from './messaging.test-helpers';

describe('Messaging Integration - Search Users Flow', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    vi.useFakeTimers();
    ctx = await setupMessagingTest();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanupMessagingTest(ctx.httpMock);
  });

  it('should search users by email', async () => {
    ctx.store.searchMails('user');

    await vi.advanceTimersByTimeAsync(350);

    const req = ctx.httpMock.expectOne(
      (request) =>
        request.url.includes('/users/search-by-email') &&
        request.params.get('email') === 'user'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    expect(ctx.store.searchResults()).toEqual(mockUsers);
    expect(ctx.store.isSearching()).toBe(false);
  });

  it('should handle empty search query', async () => {
    ctx.store.searchMails('');

    await vi.advanceTimersByTimeAsync(350);

    expect(ctx.store.searchResults()).toEqual([]);
    expect(ctx.store.isSearching()).toBe(false);
  });

  it('should handle search error', async () => {
    ctx.store.searchMails('test');

    await vi.advanceTimersByTimeAsync(350);

    const req = ctx.httpMock.expectOne((request) =>
      request.url.includes('/users/search-by-email')
    );

    req.flush(
      { message: 'Search failed' },
      { status: 500, statusText: 'Server Error' }
    );

    expect(ctx.store.error()).toBe('messaging.storeErrors.searchFailed');
    expect(ctx.store.searchResults()).toEqual([]);
    expect(ctx.store.isSearching()).toBe(false);
  });
});
