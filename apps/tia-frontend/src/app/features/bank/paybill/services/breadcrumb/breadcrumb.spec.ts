import { TestBed } from '@angular/core/testing';
import { BreadcrumbService } from './breadcrumb';
import { NavigationEnd, Router, Event } from '@angular/router';
import { Subject } from 'rxjs';

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;
  let routerEvents$: Subject<Event>;
  let mockRouter: any;

  beforeEach(() => {
    routerEvents$ = new Subject<Event>();

    mockRouter = {
      url: '/bank/paybill/pay',
      events: routerEvents$.asObservable(),
    };

    TestBed.configureTestingModule({
      providers: [BreadcrumbService, { provide: Router, useValue: mockRouter }],
    });

    service = TestBed.inject(BreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default "Paybill" breadcrumb for base URL', () => {
    mockRouter.url = '/bank/paybill/pay';

    routerEvents$.next(
      new NavigationEnd(1, '/bank/paybill/pay', '/bank/paybill/pay'),
    );

    const crumbs = service.breadcrumbs$();

    expect(crumbs.length).toBe(1);
    expect(crumbs[0].label).toBe('Paybill');
    expect(crumbs[0].route).toBe('bank/paybill/pay');
  });

  it('should format multi-word segments and generate correct routes', () => {
    mockRouter.url = '/bank/paybill/utility-payments/electricity';

    routerEvents$.next(new NavigationEnd(1, mockRouter.url, mockRouter.url));

    const crumbs = service.breadcrumbs$();

    expect(crumbs.length).toBe(3);

    expect(crumbs[1].label).toBe('Utility Payments');
    expect(crumbs[1].route).toContain('/paybill/utility-payments');

    expect(crumbs[2].label).toBe('Electricity');
    expect(crumbs[2].route).toContain('/paybill/utility-payments/electricity');
  });

  it('should ignore the "pay" segment if it appears after the anchor', () => {
    mockRouter.url = '/bank/paybill/pay/mobile-top-up';

    routerEvents$.next(new NavigationEnd(1, mockRouter.url, mockRouter.url));

    const crumbs = service.breadcrumbs$();

    expect(crumbs.length).toBe(2);
    expect(crumbs[1].label).toBe('Mobile Top Up');
  });

  it('should return default breadcrumbs if the anchor "/paybill" is missing', () => {
    mockRouter.url = '/dashboard/overview';

    routerEvents$.next(new NavigationEnd(1, mockRouter.url, mockRouter.url));

    const crumbs = service.breadcrumbs$();

    expect(crumbs.length).toBe(1);
    expect(crumbs[0].label).toBe('Paybill');
  });
});
