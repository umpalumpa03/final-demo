import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { WidgetTransactions } from './widget-transactions';

describe('WidgetTransactions', () => {
  let component: WidgetTransactions;
  let mockStore: any;

  beforeEach(() => {
    mockStore = {
      select: vi.fn().mockReturnValue(of([]))
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
});
