import { TestBed } from '@angular/core/testing';
import {
  NavigationEnd,
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

  it('should return true when navigating to a different root segment', () => {
    mockRouter.url = '/bank/dashboard';

    routerEvents$.next(
      new NavigationEnd(1, '/bank/dashboard', '/bank/dashboard'),
    );

    routerEvents$.next(new NavigationStart(2, '/storybook/components'));

    expect(service.isFeatureLoading()).toBe(true);
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
});
