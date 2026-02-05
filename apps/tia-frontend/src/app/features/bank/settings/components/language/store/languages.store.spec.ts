import { TestBed } from '@angular/core/testing';
import { LanguagesStore, initialState } from './languages.store';
import { LanguageService } from '../services/language.service';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('LanguagesStore', () => {
  let store: InstanceType<typeof LanguagesStore>;
  let languageService: any;

  beforeEach(() => {
    languageService = {
      getAvailableLanguages: vi.fn(),
      updateUserLanguage: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        LanguagesStore,
        { provide: LanguageService, useValue: languageService },
      ],
    });

    store = TestBed.inject(LanguagesStore);
  });

  it('should have initial state', () => {
    expect(store.languages()).toEqual(initialState.languages);
    expect(store.isLoading()).toBe(false);
    expect(store.hasError()).toBe(false);
  });

  it('should fetch languages successfully', async () => {
    const mockResponse = [
      { value: 'english', displayName: 'English' },
      { value: 'georgian', displayName: 'ქართული' },
    ];
    languageService.getAvailableLanguages.mockReturnValue(of(mockResponse));

    store.fetchLanguages();

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(store.isLoading()).toBe(false);
    expect(store.languages().length).toBe(2);
    expect(store.languages()[0].region).toBe('Global');
    expect(store.languages()[1].speakerCount).toBe('4M');
  });

  it('should update language successfully', async () => {
    languageService.updateUserLanguage.mockReturnValue(of({ success: true }));

    store.updateLanguage('english');

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(store.isLoading()).toBe(false);
  });

  it('should reset state', () => {
    languageService.getAvailableLanguages.mockReturnValue(
      of([{ value: 'english', displayName: 'English' }]),
    );

    store.fetchLanguages();
    store.resetState();

    expect(store.languages()).toEqual(initialState.languages);
    expect(store.isLoading()).toBe(false);
    expect(store.hasError()).toBe(false);
  });
});
