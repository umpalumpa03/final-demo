import { TestBed } from '@angular/core/testing';
import { TransactionService } from './transaction-service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, afterEach, beforeEach } from 'vitest';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get transactions with correct params', () => {
    const filters = {
      pageLimit: 10,
      pageCursor: 'abc',
      searchCriteria: 'test',
      amountFrom: 100,
      category: null,
    } as any;

    service.getTransactions(filters).subscribe();

    const req = httpMock.expectOne((req) => req.url.includes('/transactions'));

    expect(req.request.method).toBe('GET');

    expect(req.request.params.get('page[limit]')).toBe('10');
    expect(req.request.params.get('page[cursor]')).toBe('abc');
    expect(req.request.params.get('searchCriteria')).toBe('test');
    expect(req.request.params.get('amountFrom')).toBe('100');

    expect(req.request.params.has('category')).toBe(false);

    req.flush({ items: [], pageInfo: {} });
  });

  it('should handle minimal filters', () => {
    service.getTransactions({} as any).subscribe();

    const req = httpMock.expectOne((req) => req.url.includes('/transactions'));
    expect(req.request.params.keys().length).toBe(0);

    req.flush({ items: [], pageInfo: {} });
  });
});
