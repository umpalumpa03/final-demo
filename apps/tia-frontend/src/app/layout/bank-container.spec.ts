import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BankContainer } from './bank-container';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NavigationService } from 'apps/tia-frontend/src/app/core/services/navigation/navigation.service';
import { MonitorInactivity } from 'apps/tia-frontend/src/app/core/auth/services/monitor-inacticity.service';
import { TranslationLoaderService } from 'apps/tia-frontend/src/app/core/i18n';
import { signal } from '@angular/core';
import { Subject, of } from 'rxjs';

describe('BankContainer', () => {
  let component: BankContainer;
  let fixture: ComponentFixture<BankContainer>;
  let mockTranslate: {
    use: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
    instant: ReturnType<typeof vi.fn>;
    getCurrentLang: ReturnType<typeof vi.fn>;
    getFallbackLang: ReturnType<typeof vi.fn>;
    onLangChange: Subject<{ lang: string; translations?: unknown }>;
    onTranslationChange: Subject<unknown>;
    onDefaultLangChange: Subject<unknown>;
    onFallbackLangChange: Subject<unknown>;
  };
  let mockTranslationLoader: {
    getActiveModules: ReturnType<typeof vi.fn>;
    loadTranslations: ReturnType<typeof vi.fn>;
  };
  let mockStore: MockStore;
  let mockNavigationService: { isChangingAtSegment: ReturnType<typeof vi.fn> };
  let mockMonitorInactivity: { timeWarning: ReturnType<typeof signal<number>> };

  beforeEach(async () => {
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

    mockNavigationService = {
      isChangingAtSegment: vi.fn().mockReturnValue(signal(false)),
    };

    mockMonitorInactivity = {
      timeWarning: signal(30),
    };

    await TestBed.configureTestingModule({
      imports: [BankContainer],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TranslateService, useValue: mockTranslate },
        { provide: TranslationLoaderService, useValue: mockTranslationLoader },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: MonitorInactivity, useValue: mockMonitorInactivity },
        provideMockStore({
          initialState: {
            'user-info': { language: 'en' },
            ProfilePhoto: {
              savedAvatarUrl: null,
              avatarUrl: null,
              isLoading: false,
              hasError: false,
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BankContainer);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply language from store on init', async () => {
    mockTranslate.getCurrentLang.mockReturnValue('en');
    mockStore.setState({
      'user-info': { language: 'ka' },
      ProfilePhoto: {
        savedAvatarUrl: null,
        avatarUrl: null,
        isLoading: false,
        hasError: false,
      },
    });
    mockStore.refreshState();

    fixture.detectChanges();

    await vi.waitFor(() => {
      expect(mockTranslate.use).toHaveBeenCalledWith('ka');
    });
    expect(document.documentElement.lang).toBe('ka');
  });

  it('should update html lang and reload translations on lang change', async () => {
    mockTranslationLoader.getActiveModules.mockReturnValue(['settings']);

    fixture.detectChanges();

    mockTranslate.onLangChange.next({ lang: 'en' });

    await vi.waitFor(() => {
      expect(mockTranslationLoader.loadTranslations).toHaveBeenCalledWith(
        ['settings'],
        'en',
      );
    });
    expect(document.documentElement.lang).toBe('en');
  });
});
