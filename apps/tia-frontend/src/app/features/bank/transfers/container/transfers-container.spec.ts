import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { TransfersContainer } from './transfers-container';
import { TransferStore } from '../store/transfers.store';
import { TransferRepeatService } from '../services/transfer-repeat.service';
import { TranslateService } from '@ngx-translate/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Subject } from 'rxjs';
import { selectTransactionToRepeat } from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';

describe('TransfersContainer', () => {
  let component: TransfersContainer;
  let store: MockStore;
  let mockRouter: any;
  let mockRepeatService: any;
  let mockTransferStore: any;
  let routerEventsSubject: Subject<any>;

  beforeEach(() => {
    routerEventsSubject = new Subject();
    mockRouter = {
      events: routerEventsSubject.asObservable(),
      navigate: vi.fn(),
    };

    mockRepeatService = {
      initRepeatTransfer: vi.fn(),
    };

    mockTransferStore = {
      reset: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [TransfersContainer],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectTransactionToRepeat, value: null }],
        }),
        { provide: Router, useValue: mockRouter },
        { provide: TransferRepeatService, useValue: mockRepeatService },
        { provide: TransferStore, useValue: mockTransferStore },
        {
          provide: TranslateService,
          useValue: { instant: vi.fn((key) => key), get: vi.fn() },
        },
      ],
    });

    const fixture = TestBed.createComponent(TransfersContainer);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should create and initialize tabs', () => {
    expect(component).toBeTruthy();
    expect(component.transferTabs().length).toBeGreaterThan(0);
  });

  it('should handle successful repeat transfer flow', () => {
    const mockTransaction = { id: '123' } as any;
    store.overrideSelector(selectTransactionToRepeat, mockTransaction);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(component.isLoadingMeta()).toBe(true);
    expect(mockRepeatService.initRepeatTransfer).toHaveBeenCalledWith(
      mockTransaction,
    );

    routerEventsSubject.next(new NavigationEnd(1, '/test', '/test'));

    expect(component.isLoadingMeta()).toBe(false);
    expect(dispatchSpy).toHaveBeenCalledWith(
      TransactionActions.clearTransactionToRepeat(),
    );
  });

  it('should not initialize repeat if transaction is null', () => {
    store.overrideSelector(selectTransactionToRepeat, null);
    component.ngOnInit();
    expect(component.isLoadingMeta()).toBe(false);
    expect(mockRepeatService.initRepeatTransfer).not.toHaveBeenCalled();
  });

  it('should reset transfer store on destroy', () => {
    component.ngOnDestroy();
    expect(mockTransferStore.reset).toHaveBeenCalled();
  });

  it('should have initial loading state as false', () => {
    expect(component.isLoadingMeta()).toBe(false);
  });
});
