import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AppearanceStore } from '../store/appearance.store';
import { AppearanceService } from '../services/appearance-api.service';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { BreakpointService } from '@tia/core/services/breakpoints/breakpoint.service';
import { signal } from '@angular/core';
import { Subject, of } from 'rxjs';
import { vi } from 'vitest';
import { AppearanceContainer } from '../container/appearance-container';

export const mockThemesResponse = [
  { displayName: 'Ocean Blue', value: 'oceanBlue' },
  { displayName: 'Royal Blue', value: 'royalBlue' },
];

export interface AppearanceTestContext {
  httpMock: HttpTestingController;
  fixture: ReturnType<typeof TestBed.createComponent<AppearanceContainer>>;
  component: AppearanceContainer;
  activeThemeSignal: ReturnType<typeof signal<string>>;
  mockTranslate: {
    getCurrentLang: ReturnType<typeof vi.fn>;
    getFallbackLang: ReturnType<typeof vi.fn>;
    use: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
    instant: ReturnType<typeof vi.fn>;
    onLangChange: Subject<unknown>;
    onTranslationChange: Subject<unknown>;
    onDefaultLangChange: Subject<unknown>;
    onFallbackLangChange: Subject<unknown>;
  };
  mockStore: {
    dispatch: ReturnType<typeof vi.fn>;
    selectSignal: ReturnType<typeof vi.fn>;
  };
  mockAlert: {
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };
}

export async function setupAppearanceTest(): Promise<AppearanceTestContext> {
  const activeThemeSignal = signal('oceanBlue');
  const userThemeSignal = signal('oceanBlue');

  const mockStore = {
    dispatch: vi.fn(),
    selectSignal: vi.fn((selector: unknown) => {
      return selector?.toString?.().includes('selectUserTheme')
        ? userThemeSignal
        : activeThemeSignal;
    }),
  } as any;

  const mockAlert = {
    success: vi.fn(),
    error: vi.fn(),
  };

  const mockTranslate = {
    getCurrentLang: vi.fn().mockReturnValue('en'),
    getFallbackLang: vi.fn().mockReturnValue('en'),
    use: vi.fn().mockReturnValue(of(void 0)),
    get: vi.fn().mockReturnValue(of({})),
    instant: vi.fn((k: string) => k),
    onLangChange: new Subject(),
    onTranslationChange: new Subject(),
    onDefaultLangChange: new Subject(),
    onFallbackLangChange: new Subject(),
  };

  await TestBed.configureTestingModule({
    imports: [AppearanceContainer],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      AppearanceStore,
      AppearanceService,
      { provide: Store, useValue: mockStore },
      { provide: TranslateService, useValue: mockTranslate },
      { provide: AlertService, useValue: mockAlert },
      { provide: BreakpointService, useValue: { isMobile: signal(false) } },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(AppearanceContainer);
  const component = fixture.componentInstance;

  return {
    httpMock: TestBed.inject(HttpTestingController),
    fixture,
    component,
    activeThemeSignal,
    mockTranslate,
    mockStore,
    mockAlert,
  };
}

export function cleanupAppearanceTest(httpMock: HttpTestingController): void {
  try {
    httpMock.verify();
  } finally {
    TestBed.resetTestingModule();
  }
}
