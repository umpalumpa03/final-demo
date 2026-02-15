import { TestBed } from '@angular/core/testing';
import {
  GuardsCheckEnd,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { Subject } from 'rxjs';
import { NavigationService } from './navigation.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('NavigationService', () => {
  let service: NavigationService;
  let routerEvents$: Subject<RouterEvent>;
  let mockRouter: any;

  beforeEach(() => {
    routerEvents$ = new Subject<RouterEvent>();
    mockRouter = {
      events: routerEvents$.asObservable(),
      url: '/',
    };

    TestBed.configureTestingModule({
      providers: [NavigationService, { provide: Router, useValue: mockRouter }],
    });

    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be false initially', () => {
    expect(service.isFeatureLoading()).toBe(false);
  });

  it('should return false when navigating within the same root segment', () => {
    mockRouter.url = '/bank/dashboard';

    routerEvents$.next(
      new NavigationEnd(1, '/bank/dashboard', '/bank/dashboard'),
    );
    routerEvents$.next(new NavigationStart(2, '/bank/settings'));

    expect(service.isFeatureLoading()).toBe(false);
  });

  it('should return false when a navigation ends', () => {
    mockRouter.url = '/bank/dashboard';
    routerEvents$.next(new NavigationStart(1, '/storybook'));
    routerEvents$.next(new NavigationEnd(1, '/storybook', '/storybook'));

    expect(service.isFeatureLoading()).toBe(false);
  });

  it('should remain false when guards do not allow activation', () => {
    mockRouter.url = '/bank/settings';

    routerEvents$.next(
      new GuardsCheckEnd(
        1,
        '/bank/dashboard',
        '/bank/dashboard',
        {} as any,
        false,
      ),
    );

    expect(service.isFeatureLoading()).toBe(false);
  });

  it('should turn loading off on cancel or error', () => {
    mockRouter.url = '/bank/settings';

    routerEvents$.next(
      new GuardsCheckEnd(
        1,
        '/bank/dashboard',
        '/bank/dashboard',
        {} as any,
        true,
      ),
    );
    expect(service.isFeatureLoading()).toBe(false);

    routerEvents$.next(new NavigationCancel(1, '/bank/dashboard', 'cancel'));
    expect(service.isFeatureLoading()).toBe(false);

    routerEvents$.next(
      new GuardsCheckEnd(
        2,
        '/bank/transactions',
        '/bank/transactions',
        {} as any,
        true,
      ),
    );
    expect(service.isFeatureLoading()).toBe(false);

    routerEvents$.next(
      new NavigationError(2, '/bank/transactions', new Error('fail')),
    );
    expect(service.isFeatureLoading()).toBe(false);
  });
});
