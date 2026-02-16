import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NavigationService } from './core/services/navigation/navigation.service';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subject, of } from 'rxjs';

describe('App Component', () => {
  let translateService: TranslateService;
  let mockNavigationService: any;
  let mockStore: MockStore;
  let mockTranslate: {
    use: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
    instant: ReturnType<typeof vi.fn>;
    getCurrentLang: ReturnType<typeof vi.fn>;
    getFallbackLang: ReturnType<typeof vi.fn>;
    onLangChange: Subject<unknown>;
    onTranslationChange: Subject<unknown>;
    onDefaultLangChange: Subject<unknown>;
    onFallbackLangChange: Subject<unknown>;
  };

  beforeEach(async () => {
    mockNavigationService = {
      isFeatureLoading: signal(false),
    };

    mockTranslate = {
      use: vi.fn().mockReturnValue(of(void 0)),
      get: vi.fn().mockReturnValue(of({})),
      instant: vi.fn((k: string) => k),
      getCurrentLang: vi.fn().mockReturnValue('en'),
      getFallbackLang: vi.fn().mockReturnValue('en'),
      onLangChange: new Subject(),
      onTranslationChange: new Subject(),
      onDefaultLangChange: new Subject(),
      onFallbackLangChange: new Subject(),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TranslateService, useValue: mockTranslate },
        provideMockStore({ initialState: { 'user-info': { language: 'ka' } } }),
        { provide: NavigationService, useValue: mockNavigationService },
      ],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
    mockStore = TestBed.inject(MockStore);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialize with default translation setup', async () => {
    const useSpy = vi.spyOn(translateService, 'use');
    const fixture = TestBed.createComponent(App);

    mockStore.setState({ 'user-info': { language: 'ka' } });
    mockStore.refreshState();

    fixture.detectChanges();

    await vi.waitFor(() => {
      expect(useSpy).toHaveBeenCalledWith('ka');
    });
  });

  it('should reflect the loading state from NavigationService', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    mockNavigationService.isFeatureLoading.set(true);
    expect((app as any).isLoading()).toBe(true);

    mockNavigationService.isFeatureLoading.set(false);
    expect((app as any).isLoading()).toBe(false);
  });
});
