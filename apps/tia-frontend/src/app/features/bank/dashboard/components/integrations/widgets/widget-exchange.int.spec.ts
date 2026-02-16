import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { WidgetExchange } from '../../widget-exchange/widget-exchange';
import {
  selectExchangeRates,
  selectLoading,
  selectError,
} from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.selectors';
import { loadExchangeRates } from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.actions';
import { ExchangeRateInterface } from 'apps/tia-frontend/src/app/store/exchange-rates/models/exchange-rates.models';

const mockRates: ExchangeRateInterface[] = [
  {
    code: 'EUR',
    rate: 0.92,
    previousRate: 0.90,
    changePercent: 2.22,
    isPositive: true,
    name: 'Euro',
    symbol: '€',
    flagUrl: '',
    lastUpdated: '2024-01-01',
  },
  {
    code: 'GEL',
    rate: 2.65,
    previousRate: 2.70,
    changePercent: -1.85,
    isPositive: false,
    name: 'Lari',
    symbol: '₾',
    flagUrl: '',
    lastUpdated: '2024-01-01',
  },
];

describe('WidgetExchange Integration', () => {
  let component: WidgetExchange;
  let fixture: ComponentFixture<WidgetExchange>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetExchange, TranslateModule.forRoot()],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectExchangeRates, []);
    store.overrideSelector(selectLoading, false);
    store.overrideSelector(selectError, false);

    fixture = TestBed.createComponent(WidgetExchange);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render exchange rate cards when store has rates', () => {
    store.overrideSelector(selectExchangeRates, mockRates);
    store.refreshState();
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.exchange-rate-card'));
    expect(cards.length).toBe(2);

    expect(fixture.nativeElement.textContent).toContain('EUR/USD');
    expect(fixture.nativeElement.textContent).toContain('GEL/USD');
    expect(fixture.nativeElement.textContent).toContain('0.9200');
    expect(fixture.nativeElement.textContent).toContain('2.6500');
    expect(fixture.nativeElement.textContent).toContain('2.22');
    expect(fixture.nativeElement.textContent).toContain('-1.85');
  });

  it('should not show USD in the list (filtered out by component)', () => {
    const ratesWithUsd: ExchangeRateInterface[] = [
      ...mockRates,
      {
        code: 'USD',
        rate: 1,
        previousRate: 1,
        changePercent: 0,
        isPositive: true,
        name: 'US Dollar',
        symbol: '$',
        flagUrl: '',
        lastUpdated: '2024-01-01',
      },
    ];
    store.overrideSelector(selectExchangeRates, ratesWithUsd);
    store.refreshState();
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.exchange-rate-card'));
    expect(cards.length).toBe(2);
    expect(fixture.nativeElement.textContent).not.toContain('USD/USD');
  });

  it('should show loader when loading', () => {
    store.overrideSelector(selectLoading, true);
    store.overrideSelector(selectExchangeRates, []);
    store.refreshState();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-route-loader'))).toBeTruthy();
  });

  it('should show error state and retry dispatches loadExchangeRates', () => {
    store.overrideSelector(selectLoading, false);
    store.overrideSelector(selectError, true);
    store.overrideSelector(selectExchangeRates, []);
    store.refreshState();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-error-states'))).toBeTruthy();

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.retryLoad();
    expect(dispatchSpy).toHaveBeenCalledWith(
      loadExchangeRates({ baseCurrency: 'USD', forceRefresh: true }),
    );
  });
});
