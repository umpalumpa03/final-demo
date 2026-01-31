import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillMain } from './paybill-main';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import * as PAYBILL_SELECTORS from '../../../store/paybill.selectors';
import { PaybillCategory } from '../shared/models/paybill.model';
import { PaybillActions } from '../../../store/paybill.actions';

describe('PaybillMain', () => {
  let component: PaybillMain;
  let fixture: ComponentFixture<PaybillMain>;
  let store: MockStore;
  let router: Router;
  let route: ActivatedRoute;

  const initialState = {
    paybill: {
      categories: [],
      selectedCategoryId: null,
      selectedProviderId: null,
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillMain],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            { selector: PAYBILL_SELECTORS.selectCategories, value: [] },
            { selector: PAYBILL_SELECTORS.selectActiveCategory, value: null },
            { selector: PAYBILL_SELECTORS.selectActiveProvider, value: null },
            { selector: PAYBILL_SELECTORS.selectLoading, value: false },
          ],
        }),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillMain);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Computed: formattedCategories', () => {
    it('should format categories with valid providers correctly', () => {
      const mockRawCategories: PaybillCategory[] = [
        {
          id: 'phone',
          name: 'Phone',
          icon: 'icon.svg',
          description: 'desc',
          servicesQuantity: 2,
          providers: [
            { id: 'p1', serviceName: 'Provider 1', categoryId: 'phone' },
          ],
        },
      ];

      store.overrideSelector(
        PAYBILL_SELECTORS.selectCategories,
        mockRawCategories,
      );
      store.refreshState();
      fixture.detectChanges();

      const formatted = component.formattedCategories();
      expect(formatted[0].count).toBe(1);
    });

    it('should handle category with undefined providers (fallback to 0 count)', () => {
      const mockRawCategories: PaybillCategory[] = [
        {
          id: 'test',
          name: 'Test',
          icon: 'icon.svg',
          description: 'desc',
          servicesQuantity: 0,
          providers: undefined,
        },
      ];

      store.overrideSelector(
        PAYBILL_SELECTORS.selectCategories,
        mockRawCategories,
      );
      store.refreshState();
      fixture.detectChanges();

      const formatted = component.formattedCategories();
      expect(formatted[0].count).toBe(0);
    });

    it('should use fallback config color for unknown category IDs', () => {
      const mockRawCategories: PaybillCategory[] = [
        {
          id: 'unknown-id',
          name: 'Unknown',
          icon: 'icon.svg',
          description: 'desc',
          servicesQuantity: 0,
          providers: [],
        },
      ];

      store.overrideSelector(
        PAYBILL_SELECTORS.selectCategories,
        mockRawCategories,
      );
      store.refreshState();
      fixture.detectChanges();

      const formatted = component.formattedCategories();
      expect(formatted[0].iconBgColor).toBe('#F5F5F5');
    });
  });

  describe('Navigation Methods', () => {
    it('should navigate relative to route when selecting a category', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      component.selectCategory('Utilities');

      expect(navigateSpy).toHaveBeenCalledWith(['utilities'], {
        relativeTo: route,
      });
    });

    it('should dispatch checkBill on verifyAccount', () => {
      const spy = vi.spyOn(store, 'dispatch');
      vi.spyOn(component, 'activeProvider').mockReturnValue({
        id: 'p1',
      } as any);

      component.onVerifyAccount({ accountNumber: '12345' });

      expect(spy).toHaveBeenCalledWith(
        PaybillActions.checkBill({ serviceId: 'p1', accountNumber: '12345' }),
      );
    });

    it('should navigate to category and provider on selectProvider', () => {
      const navSpy = vi.spyOn(router, 'navigate');
      vi.spyOn(component, 'activeCategory').mockReturnValue({
        id: 'internet',
      } as any);

      component.selectProvider('netflow');

      expect(navSpy).toHaveBeenCalledWith(
        ['internet', 'netflow'],
        expect.anything(),
      );
    });
  });

  it('should dispatch confirmPayment when onOtpVerified is called', () => {
    const spy = vi.spyOn(store, 'dispatch');
    vi.spyOn(component, 'challengeId' as any).mockReturnValue('mock-challenge');

    component.onOtpVerified('1111');

    expect(spy).toHaveBeenCalledWith(
      PaybillActions.confirmPayment({
        payload: { challengeId: 'mock-challenge', code: '1111' },
      }),
    );
  });

  it('should dispatch proceedPayment when onProceedToPayment is called', () => {
    const spy = vi.spyOn(store, 'dispatch');
    vi.spyOn(component, 'activeProvider').mockReturnValue({ id: 'p1' } as any);

    component.onProceedToPayment({ accountNumber: '123', amount: 100 });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: PaybillActions.proceedPayment.type,
      }),
    );
  });
});
