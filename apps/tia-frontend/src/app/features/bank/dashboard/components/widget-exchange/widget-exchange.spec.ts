import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { WidgetExchange } from './widget-exchange';

describe('WidgetExchange', () => {
  let component: WidgetExchange;
  let mockStore: any;

  beforeEach(() => {
    mockStore = {
      select: vi.fn().mockReturnValue(of([]))
    };

    TestBed.configureTestingModule({
      imports: [WidgetExchange],
      providers: [
        { provide: Store, useValue: mockStore }
      ]
    });

    const fixture = TestBed.createComponent(WidgetExchange);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter out USD from exchange rates', async () => {
    mockStore.select.mockReturnValue(of([
      { code: 'USD', rate: 1 },
      { code: 'EUR', rate: 0.85 }
    ]));

    const fixture = TestBed.createComponent(WidgetExchange);
    component = fixture.componentInstance;

    const rates: any = await new Promise(resolve => {
      component.exchangeRates$.subscribe(resolve);
    });

    expect(rates.length).toBe(1);
    expect(rates[0].code).toBe('EUR');
  });
});
