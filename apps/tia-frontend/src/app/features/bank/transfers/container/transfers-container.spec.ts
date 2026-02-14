import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing'; 
import { TransfersContainer } from './transfers-container';
import { TransferStore } from '../store/transfers.store';
import { TransferRepeatService } from '../services/transfer-repeat.service';
import { TranslateModule } from '@ngx-translate/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Subject } from 'rxjs';
import { selectTransactionToRepeat } from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';

describe('TransfersContainer', () => {
  let component: TransfersContainer;
  let fixture: ComponentFixture<TransfersContainer>;
  let store: MockStore;
  let mockRepeatService: any;
  let mockTransferStore: any;
  let routerEventsSubject: Subject<any>;
  let router: Router;

  beforeEach(() => {
    vi.useFakeTimers();
    routerEventsSubject = new Subject();

    mockRepeatService = {
      initRepeatTransfer: vi.fn(),
    };

    mockTransferStore = {
      reset: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [
        TransfersContainer,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectTransactionToRepeat, value: null }],
        }),
        { provide: TransferRepeatService, useValue: mockRepeatService },
        { provide: TransferStore, useValue: mockTransferStore },
      ],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    
    vi.spyOn(router, 'events', 'get').mockReturnValue(
      routerEventsSubject.asObservable(),
    );
    vi.spyOn(router, 'navigate').mockImplementation(vi.fn());

    fixture = TestBed.createComponent(TransfersContainer);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should handle successful repeat transfer flow and stop loading on NavigationEnd', () => {
    const mockTransaction = { id: '123' } as any;
    store.overrideSelector(selectTransactionToRepeat, mockTransaction);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(component.isLoadingMeta()).toBe(true);

    routerEventsSubject.next(new NavigationEnd(1, '/test', '/test'));

    vi.runAllTimers();

    expect(component.isLoadingMeta()).toBe(false);
    expect(dispatchSpy).toHaveBeenCalledWith(
      TransactionActions.clearTransactionToRepeat(),
    );
  });

  it('should trigger stopLoading via timeout if navigation fails to complete', () => {
    const mockTransaction = { id: '123' } as any;
    store.overrideSelector(selectTransactionToRepeat, mockTransaction);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    fixture.detectChanges();
    expect(component.isLoadingMeta()).toBe(true);

    vi.advanceTimersByTime(5000);

    expect(component.isLoadingMeta()).toBe(false);
    expect(dispatchSpy).toHaveBeenCalledWith(
      TransactionActions.clearTransactionToRepeat(),
    );
  });

  it('should not initialize repeat if transaction is null', () => {
    store.overrideSelector(selectTransactionToRepeat, null);
    fixture.detectChanges();

    expect(component.isLoadingMeta()).toBe(false);
    expect(mockRepeatService.initRepeatTransfer).not.toHaveBeenCalled();
  });

  it('should reset transfer store on destroy', () => {
    component.ngOnDestroy();
    expect(mockTransferStore.reset).toHaveBeenCalled();
  });
});
