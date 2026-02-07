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
    ctx = await setupMessagingTest();
  });

  afterEach(() => {
    cleanupMessagingTest(ctx.httpMock);
  });

  it('should search users by email', async () => {
    ctx.store.searchMails('user');

    await new Promise(resolve => setTimeout(resolve, 350));

    const req = ctx.httpMock.expectOne(
      (request) =>
        request.url.includes('/users/search-by-email') &&
        request.params.get('email') === 'user'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    await vi.waitFor(() => {
      expect(ctx.store.searchResults()).toEqual(mockUsers);
      expect(ctx.store.isSearching()).toBe(false);
    });
  });

  it('should handle empty search query', async () => {
    ctx.store.searchMails('');

    await new Promise(resolve => setTimeout(resolve, 350));

    await vi.waitFor(() => {
      expect(ctx.store.searchResults()).toEqual([]);
      expect(ctx.store.isSearching()).toBe(false);
    }, { timeout: 500 });
  });

  it('should handle search error', async () => {
    ctx.store.searchMails('test');

    await new Promise(resolve => setTimeout(resolve, 350));

    const req = ctx.httpMock.expectOne((request) =>
      request.url.includes('/users/search-by-email')
    );

    req.flush(
      { message: 'Search failed' },
      { status: 500, statusText: 'Server Error' }
    );

    await vi.waitFor(() => {
      expect(ctx.store.error()).toBe('messaging.storeErrors.searchFailed');
      expect(ctx.store.searchResults()).toEqual([]);
      expect(ctx.store.isSearching()).toBe(false);
    });
  });
});
