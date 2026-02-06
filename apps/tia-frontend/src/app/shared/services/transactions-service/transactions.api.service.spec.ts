import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { environment } from '../../../../environments/environment';
import { TransactionApiService } from './transactions.api.service';

describe('TransactionApiService', () => {
  let service: TransactionApiService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TransactionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call getTransactions and pass generated params', () => {
    const filters = {
      pageLimit: 10,
      searchCriteria: 'test',
    } as any;

    service.getTransactions(filters).subscribe((response) => {
      expect(response.items.length).toBe(0);
    });
    const req = httpMock.expectOne(
      (req) =>
        req.url === `${apiUrl}/transactions` &&
        req.params.has('page[limit]') &&
        req.params.get('searchCriteria') === 'test',
    );

    expect(req.request.method).toBe('GET');
    req.flush({ items: [], pageInfo: {} });
  });

  it('should call getTransactionsTotal', () => {
    const mockTotal = 150;

    service.getTransactionsTotal().subscribe((total) => {
      expect(total).toBe(mockTotal);
    });

    const req = httpMock.expectOne(`${apiUrl}/transactions/total`);
    expect(req.request.method).toBe('GET');

    req.flush(mockTotal);
  });

  it('should call getTransactionsCategories', () => {
    const mockCategories = [{ id: '1', categoryName: 'Food' }] as any;

    service.getTransactionsCategories().subscribe((categories) => {
      expect(categories.length).toBe(1);
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${apiUrl}/transactions/categories`);
    expect(req.request.method).toBe('GET');

    req.flush(mockCategories);
  });

  it('should call createTransactionCategory with correct body', () => {
    const categoryName = 'New Category';
    const mockResponse = { id: '123', categoryName };

    service.createTransactionCategory(categoryName).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/transactions/categories`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ categoryName });

    req.flush(mockResponse);
  });

  it('should call categorizeTransaction with correct url and body', () => {
    const transactionId = 'tx-123';
    const categoryId = 'cat-456';
    const mockResponse = 'success';

    service
      .categorizeTransaction(transactionId, categoryId)
      .subscribe((res) => {
        expect(res).toBe(mockResponse);
      });

    const req = httpMock.expectOne(
      `${apiUrl}/transactions/change-category/${transactionId}`,
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ categoryId });

    req.flush(mockResponse);
  });
});
