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
    const req = httpMock.expectOne((req) => 
        req.url === `${apiUrl}/transactions` && 
        req.params.has('page[limit]') &&
        req.params.get('searchCriteria') === 'test'
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
});