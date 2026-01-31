import { TestBed } from '@angular/core/testing';
import { App } from './app';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  provideRouter,
} from '@angular/router';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('App Component', () => {
  let router: Router;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    router = TestBed.inject(Router);
    translateService = TestBed.inject(TranslateService);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialize language from localStorage in constructor', () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue('ka');
    const useSpy = vi.spyOn(translateService, 'use');

    TestBed.createComponent(App);

    expect(getItemSpy).toHaveBeenCalledWith('language');
    expect(useSpy).toHaveBeenCalledWith('ka');
    getItemSpy.mockRestore();
  });

  it('should default to "en" if localStorage is empty', () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue(null);
    const useSpy = vi.spyOn(translateService, 'use');

    TestBed.createComponent(App);

    expect(useSpy).toHaveBeenCalledWith('en');
    getItemSpy.mockRestore();
  });

  it('should correctly identify root segment of url', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect((app as any).getRootSegment('/bank/transfers')).toBe('bank');
    expect((app as any).getRootSegment('')).toBe('');
  });

  it('should set isLoading to true when navigating to a different root segment', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const events = router.events as Subject<any>;

    vi.spyOn(router, 'url', 'get').mockReturnValue('/bank/dashboard');
    events.next(new NavigationEnd(1, '/bank/dashboard', '/bank/dashboard'));

    events.next(new NavigationStart(2, '/settings/profile'));

    expect(app.isLoading()).toBe(true);
  });

  it('should set isLoading to false when navigating within the same root segment', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const events = router.events as Subject<any>;

    vi.spyOn(router, 'url', 'get').mockReturnValue('/bank/dashboard');
    events.next(new NavigationEnd(1, '/bank/dashboard', '/bank/dashboard'));

    events.next(new NavigationStart(2, '/bank/transfers'));

    expect(app.isLoading()).toBe(false);
  });

  it('should reset isLoading to false on NavigationEnd', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const events = router.events as Subject<any>;

    events.next(new NavigationStart(1, '/settings'));
    events.next(new NavigationEnd(1, '/settings', '/settings'));

    expect(app.isLoading()).toBe(false);
  });
});
