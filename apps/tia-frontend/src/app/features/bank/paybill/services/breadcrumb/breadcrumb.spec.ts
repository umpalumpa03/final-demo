import { TestBed } from '@angular/core/testing';
import { BreadcrumbService } from './breadcrumb';
import { NavigationEnd, Router, Event } from '@angular/router';
import { Subject } from 'rxjs';
import { signal } from '@angular/core';
import { PaybillMainFacade } from '../../components/paybill-main/services/paybill-main-facade';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;
  let routerEvents$: Subject<Event>;
  let mockRouter: any;
  let mockFacade: any;

  beforeEach(() => {
    routerEvents$ = new Subject<Event>();

    mockRouter = {
      url: '/bank/paybill/pay',
      events: routerEvents$.asObservable(),
    };

    mockFacade = {
      categories: signal([
        { id: 'utility-payments', name: 'Utility Payments' },
      ]),
      activeCategory: signal({
        providers: [{ id: 'electricity', name: 'Electricity' }],
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        BreadcrumbService,
        { provide: Router, useValue: mockRouter },
        { provide: PaybillMainFacade, useValue: mockFacade },
      ],
    });

    service = TestBed.inject(BreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default "Paybill" breadcrumb for the base pay URL', () => {
    mockRouter.url = '/bank/paybill/pay';
    routerEvents$.next(new NavigationEnd(1, mockRouter.url, mockRouter.url));

    const crumbs = service.breadcrumbs$();

    expect(crumbs.length).toBe(1);
    expect(crumbs[0].label).toBe('Paybill');
    expect(crumbs[0].route).toBe('/bank/paybill/pay');
  });

  it('should include "Templates" when the URL contains /templates', () => {
    mockRouter.url = '/bank/paybill/templates';
    routerEvents$.next(new NavigationEnd(1, mockRouter.url, mockRouter.url));

    const crumbs = service.breadcrumbs$();

    expect(crumbs.length).toBe(2);
    expect(crumbs[1].label).toBe('Templates');
    expect(crumbs[1].route).toBe('/bank/paybill/templates');
  });

  it('should resolve labels from the facade for dynamic segments', () => {
    mockRouter.url = '/bank/paybill/pay/utility-payments/electricity';
    routerEvents$.next(new NavigationEnd(1, mockRouter.url, mockRouter.url));

    const crumbs = service.breadcrumbs$();

    expect(crumbs.length).toBe(3);

    expect(crumbs[1].label).toBe('Utility Payments');
    expect(crumbs[1].route).toBe('/bank/paybill/pay/utility-payments');

    expect(crumbs[2].label).toBe('Electricity');
    expect(crumbs[2].route).toBe(
      '/bank/paybill/pay/utility-payments/electricity',
    );
  });

  it('should fallback to title-case formatting if ID is not found in facade', () => {
    mockRouter.url = '/bank/paybill/pay/unknown-provider';
    routerEvents$.next(new NavigationEnd(1, mockRouter.url, mockRouter.url));

    const crumbs = service.breadcrumbs$();

    expect(crumbs.length).toBe(2);

    expect(crumbs[1].label).toBe('Unknown Provider');
  });

  it('should return only "Paybill" if the URL does not contain the anchor', () => {
    mockRouter.url = '/bank/paybill/some-other-page';
    routerEvents$.next(new NavigationEnd(1, mockRouter.url, mockRouter.url));

    const crumbs = service.breadcrumbs$();

    expect(crumbs.length).toBe(1);
    expect(crumbs[0].label).toBe('Paybill');
  });
});
