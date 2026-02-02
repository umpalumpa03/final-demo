import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { WidgetTransactions } from './widget-transactions';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';

describe('WidgetTransactions', () => {
  let component: WidgetTransactions;
  let mockStore: any;

  beforeEach(() => {
    mockStore = {
      select: vi.fn().mockReturnValue(of([])),
      dispatch: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [WidgetTransactions],
      providers: [
        { provide: Store, useValue: mockStore }
      ]
    });

    const fixture = TestBed.createComponent(WidgetTransactions);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have transactions$ observable', () => {
    expect(component.transactions$).toBeDefined();
  });

  it('should have isLoading$ observable', () => {
    expect(component.isLoading$).toBeDefined();
  });

  it('should have error$ observable', () => {
    expect(component.error$).toBeDefined();
  });

  it('should call loadMore when onScrollBottom is triggered', () => {
    const spy = vi.spyOn(component, 'loadMore');

    component.onScrollBottom();

    expect(spy).toHaveBeenCalled();
  });

  it('should dispatch loadMore action', () => {
    component.loadMore();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      TransactionActions.loadMore()
    );
  });

  it('should dispatch enter action on retryLoad', () => {
    component.retryLoad();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      TransactionActions.enter()
    );
  });


});
