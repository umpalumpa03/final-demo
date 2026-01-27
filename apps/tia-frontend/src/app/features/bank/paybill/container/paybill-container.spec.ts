import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillContainer } from './paybill-container';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  provideRouter,
  Router,
  NavigationEnd,
  ActivatedRoute,
  Event,
} from '@angular/router';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { PaybillActions } from '../store/paybill.actions';
import * as fromSelectors from '../store/paybill.selectors';
import { Subject, of } from 'rxjs';
import { PaybillCategory, PaybillProvider } from '../models/paybill.model';

describe('PaybillContainer', () => {
  let component: PaybillContainer;
  let fixture: ComponentFixture<PaybillContainer>;
  let store: MockStore;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let routerEventsSubject: Subject<Event>;

  const mockProvider: PaybillProvider = {
    serviceId: 'p1',
    serviceName: 'Water Co',
    category: 'utilities',
  };

  const mockCategory: PaybillCategory = {
    id: 'c1',
    name: 'Utilities',
    icon: 'icon-path',
    description: 'Utility bills',
    servicesQuantity: 1,
    providers: [mockProvider],
  };

  const initialState = {
    paybill: {
      categories: [mockCategory],
      providers: [mockProvider],
      selectedCategoryId: null,
      selectedProviderId: null,
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    routerEventsSubject = new Subject<Event>();

    await TestBed.configureTestingModule({
      imports: [PaybillContainer],
      providers: [
        provideMockStore({ initialState }),
        provideRouter([]),
        {
          provide: ActivatedRoute,

          useValue: {
            params: of({}),
            snapshot: { params: {} },
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    Object.defineProperty(router, 'events', {
      get: () => routerEventsSubject.asObservable(),
    });

    vi.spyOn(router, 'url', 'get').mockReturnValue('/bank/paybill');

    fixture = TestBed.createComponent(PaybillContainer);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Lifecycle & Initialization', () => {
    it('should dispatch loadCategories on ngOnInit', () => {
      const spy = vi.spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(spy).toHaveBeenCalledWith(PaybillActions.loadCategories());
    });
  });

  describe('Breadcrumbs Coverage', () => {
    it('should show category and provider labels in breadcrumbs when selected', () => {
      store.overrideSelector(fromSelectors.selectActiveCategory, {
        ...mockCategory,
        providers: [mockProvider],
      });
      store.overrideSelector(fromSelectors.selectActiveProvider, mockProvider);

      store.refreshState();
      fixture.detectChanges();

      const crumbs = component.breadcrumbs();
      expect(crumbs.length).toBe(3);
      expect(crumbs[2].label).toBe('Water Co');
    });

    it('should show Templates breadcrumb when route ID matches', () => {
      store.overrideSelector(
        fromSelectors.selectSelectedCategoryId,
        'TEMPLATES',
      );
      store.refreshState();
      fixture.detectChanges();

      const crumbs = component.breadcrumbs();
      expect(crumbs.some((c) => c.label === 'Templates')).toBe(true);
    });
  });

  describe('User Interaction Methods', () => {
    it('should dispatch selectCategory action on handleCategorySelect', () => {
      const spy = vi.spyOn(store, 'dispatch');
      component.handleCategorySelect(mockCategory);
      expect(spy).toHaveBeenCalledWith(
        PaybillActions.selectCategory({ categoryId: 'c1' }),
      );
    });

    it('should dispatch selectProvider action on handleProviderSelect', () => {
      const spy = vi.spyOn(store, 'dispatch');
      component.handleProviderSelect(mockProvider);
      expect(spy).toHaveBeenCalledWith(
        PaybillActions.selectProvider({ providerId: 'p1' }),
      );
    });

    it('should dispatch clearSelection action on navigateBack', () => {
      const spy = vi.spyOn(store, 'dispatch');
      component.navigateBack();
      expect(spy).toHaveBeenCalledWith(PaybillActions.clearSelection());
    });
  });

  describe('Native Click Handling', () => {
    it('should clear selection when clicking "Paybill" breadcrumb', () => {
      const spy = vi.spyOn(store, 'dispatch');
      const mockEvent = {
        target: { textContent: 'Paybill' },
      } as unknown as MouseEvent;
      component.handleNativeClick(mockEvent);
      expect(spy).toHaveBeenCalledWith(PaybillActions.clearSelection());
    });
  });

  it('should NOT dispatch if clicked text matches nothing', () => {
    const spy = vi.spyOn(store, 'dispatch');
    const mockEvent = {
      target: { textContent: 'Random Text' },
    } as unknown as MouseEvent;
    component.handleNativeClick(mockEvent);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should NOT dispatch clearSelection if URL is not base paybill even if params are missing', async () => {
    const spy = vi.spyOn(store, 'dispatch');
    vi.spyOn(router, 'url', 'get').mockReturnValue('/bank/paybill/other');
    activatedRoute.snapshot.params = {};

    routerEventsSubject.next(
      new NavigationEnd(1, '/bank/paybill/other', '/bank/paybill/other'),
    );
    fixture.detectChanges();
    await fixture.whenStable();

    expect(spy).not.toHaveBeenCalledWith(PaybillActions.clearSelection());
  });
});
