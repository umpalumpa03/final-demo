import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { LanguagesStore } from '../store/languages.store';
import { LanguageService } from '../services/language-api.service';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { TranslationLoaderService } from 'apps/tia-frontend/src/app/core/i18n';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { Language } from '../models/language.model';
import { LanguageSelection } from '../components/language-selection/language-selection';

export const mockLanguagesResponse = [
  { value: 'english', displayName: 'English' },
  { value: 'georgian', displayName: 'ქართული' },
];

export const mockLanguagesInput: Language[] = [
  {
    id: 'english',
    name: 'English',
    nativeName: 'English',
    flagUrl: 'flag-en.svg',
    value: 'en',
    region: 'United States',
    speakerCount: '1.5B',
  },
  {
    id: 'georgian',
    name: 'Georgian',
    nativeName: 'ქართული',
    flagUrl: 'flag-ka.svg',
    value: 'ka',
    region: 'Georgia',
    speakerCount: '4M',
  },
];

export interface LanguageStoreTestContext {
  httpMock: HttpTestingController;
  store: InstanceType<typeof LanguagesStore>;
  mockStore: { dispatch: ReturnType<typeof vi.fn> };
}

export interface LanguageSelectionTestContext {
  httpMock: HttpTestingController;
  fixture: ReturnType<typeof TestBed.createComponent<LanguageSelection>>;
  component: LanguageSelection;
  mockTranslate: {
    getCurrentLang: ReturnType<typeof vi.fn>;
    use: ReturnType<typeof vi.fn>;
    instant: ReturnType<typeof vi.fn>;
  };
  mockTranslationLoader: {
    loadTranslations: ReturnType<typeof vi.fn>;
    clearCache: ReturnType<typeof vi.fn>;
  };
  mockAlert: {
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };
}

export async function setupLanguageStoreTest(): Promise<LanguageStoreTestContext> {
  const mockStore = { dispatch: vi.fn() };

  await TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      LanguagesStore,
      LanguageService,
      { provide: Store, useValue: mockStore },
    ],
  }).compileComponents();

  return {
    httpMock: TestBed.inject(HttpTestingController),
    store: TestBed.inject(LanguagesStore),
    mockStore,
  };
}

export async function setupLanguageSelectionTest(): Promise<LanguageSelectionTestContext> {
  const mockTranslate = {
    getCurrentLang: vi.fn().mockReturnValue('en'),
    use: vi.fn().mockReturnValue(of(void 0)),
    instant: vi.fn((key: string) => key),
  };

  const mockTranslationLoader = {
    loadTranslations: vi.fn().mockReturnValue(of(void 0)),
    clearCache: vi.fn(),
  };

  const mockAlert = {
    success: vi.fn(),
    error: vi.fn(),
  };

  await TestBed.configureTestingModule({
    imports: [LanguageSelection],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      LanguagesStore,
      LanguageService,
      { provide: Store, useValue: { dispatch: vi.fn() } },
      { provide: TranslateService, useValue: mockTranslate },
      { provide: TranslationLoaderService, useValue: mockTranslationLoader },
      { provide: AlertService, useValue: mockAlert },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(LanguageSelection);
  fixture.componentRef.setInput('languages', mockLanguagesInput);
  fixture.componentRef.setInput('isLoading', false);
  fixture.componentRef.setInput('hasError', false);
  fixture.componentRef.setInput('hasLoaded', true);
  fixture.componentRef.setInput('isFetching', false);

  const component = fixture.componentInstance;
  return {
    httpMock: TestBed.inject(HttpTestingController),
    fixture,
    component,
    mockTranslate,
    mockTranslationLoader,
    mockAlert,
  };
}

export function cleanupLanguageTest(httpMock: HttpTestingController): void {
  try {
    httpMock.verify();
  } finally {
    TestBed.resetTestingModule();
  }
}
