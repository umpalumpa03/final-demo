import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { vi } from 'vitest';

describe('App Component', () => {
  let routerEvents: Subject<any>;

  beforeEach(async () => {
    routerEvents = new Subject();
    
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]), 
        provideTranslateService(),
        {
          provide: Router,
          useValue: {
            events: routerEvents.asObservable(),
            url: '/',
            parseUrl: vi.fn(),
          }
        }
      ],
    }).compileComponents();
    
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('ka');
  });

  it('should create the app and set language from localStorage', () => {
    const translateService = TestBed.inject(TranslateService);
    const useSpy = vi.spyOn(translateService, 'use');
    
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
    expect(useSpy).toHaveBeenCalledWith('ka');
  });

  it('should update isLoading to true when moving between root segments', () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    
    routerEvents.next(new NavigationEnd(1, '/', '/'));
    
    (router as any).url = '/bank/dashboard';
    routerEvents.next(new NavigationStart(2, '/auth/login'));
    
    expect(fixture.componentInstance.isLoading()).toBe(true);
  });

  it('should update isLoading to false when moving within same root segment', () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    
    routerEvents.next(new NavigationEnd(1, '/bank/dashboard', '/bank/dashboard'));
    
    (router as any).url = '/bank/dashboard';
    routerEvents.next(new NavigationStart(2, '/bank/transfers'));
    
    expect(fixture.componentInstance.isLoading()).toBe(false);
  });

  it('should return empty string for root segment of empty url', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect((app as any).getRootSegment('')).toBe('');
  });

  it('should correctly identify root segment of url', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect((app as any).getRootSegment('/bank/transfers')).toBe('bank');
  });
});