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
import { TranslationLoaderService } from './core/i18n';

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
  let mockTranslationLoader: {
    getActiveModules: ReturnType<typeof vi.fn>;
    loadTranslations: ReturnType<typeof vi.fn>;
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

    mockTranslationLoader = {
      getActiveModules: vi.fn().mockReturnValue([]),
      loadTranslations: vi.fn().mockReturnValue(of(void 0)),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TranslateService, useValue: mockTranslate },
        { provide: TranslationLoaderService, useValue: mockTranslationLoader },
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

  it('should not change language when none saved', async () => {
    const useSpy = vi.spyOn(translateService, 'use');
    const fixture = TestBed.createComponent(App);

    mockStore.setState({ 'user-info': { language: null } });
    mockStore.refreshState();
    fixture.detectChanges();

    await vi.waitFor(() => {
      expect(useSpy).not.toHaveBeenCalled();
    });
  });

  it('should switch to english when saved language is english', async () => {
    const useSpy = vi.spyOn(translateService, 'use');
    vi.spyOn(translateService, 'getCurrentLang').mockReturnValue('ka');
    const fixture = TestBed.createComponent(App);

    mockStore.setState({ 'user-info': { language: 'english' } });
    mockStore.refreshState();
    fixture.detectChanges();

    await vi.waitFor(() => {
      expect(useSpy).toHaveBeenCalledWith('en');
    });
    expect(document.documentElement.lang).toBe('en');
  });

  it('should update html lang on language change without active modules', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    mockTranslationLoader.getActiveModules.mockReturnValue([]);
    mockTranslate.onLangChange.next({ lang: 'en' });

    await vi.waitFor(() => {
      expect(document.documentElement.lang).toBe('en');
      expect(mockTranslationLoader.loadTranslations).not.toHaveBeenCalled();
    });
  });

  it('should reload translations when active modules exist', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    mockTranslationLoader.getActiveModules.mockReturnValue(['settings']);
    mockTranslate.onLangChange.next({ lang: 'ka' });

    await vi.waitFor(() => {
      expect(mockTranslationLoader.loadTranslations).toHaveBeenCalledWith(
        ['settings'],
        'ka',
      );
      expect(document.documentElement.lang).toBe('ka');
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
