import { TestBed } from '@angular/core/testing';
import { TransactionsViewModelService } from './transactions-view-model.service';
import { TransactionsFacadeService } from './transactions-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Subject } from 'rxjs';
import { signal } from '@angular/core';

describe('TransactionsViewModelService', () => {
  let service: TransactionsViewModelService;

  const mockFacade = {
    currencyList: signal(['USD', 'GEL']),
    accounts: signal([]),
    totalTransactions: signal(100),
    items: signal([]),
  };

  const langChange$ = new Subject();
  const mockTranslate = {
    instant: vi.fn((key, params) => {
      if (params) return `Translated ${params.fetched}/${params.total}`;
      return `Translated ${key}`;
    }),
    onLangChange: langChange$.asObservable(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionsViewModelService,
        { provide: TransactionsFacadeService, useValue: mockFacade },
        { provide: TranslateService, useValue: mockTranslate },
      ],
    });
    service = TestBed.inject(TransactionsViewModelService);

    mockFacade.items.set([]);
    mockFacade.accounts.set([]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should map currency options correctly', () => {
    const options = service.currencyOptions();

    expect(options).toEqual([
      { label: 'USD', value: 'USD' },
      { label: 'GEL', value: 'GEL' },
    ]);
  });

  it('should generate total transactions string', () => {
    const str = service.totalTransactionsString();

    expect(str).toBe('Translated 0/100');
    expect(mockTranslate.instant).toHaveBeenCalledWith(
      'transactions.table.showing_text',
      { fetched: '0', total: '100' },
    );
  });

  it('should map account options when accounts exist', () => {
    mockFacade.accounts.set([
      { friendlyName: 'My Bank', iban: 'GE123' },
    ] as any);

    const options = service.accountOptions();

    expect(options).toEqual([{ label: 'My Bank', value: 'GE123' }]);
  });

  it('should map table config and set hasMeta to true if meta exists', () => {
    const mockItem = {
      id: '1',
      amount: 10,
      currency: 'GEL',
      date: '2022-01-01',
      description: 'Test',
      meta: { someKey: 'value' },
    };
    mockFacade.items.set([mockItem] as any);

    const config = service.tableConfig();
    expect(config.headers[0].title).toContain('Translated');
    expect(config.rows[0].hasMeta).toBe(true);
  });
});
