import { TestBed } from '@angular/core/testing';
import { LanguagesStore, initialState } from './languages.store';
import { LanguageService } from '../services/language-api.service';
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
    expect(store.isRefreshing()).toBe(false);
    expect(store.hasError()).toBe(false);
    expect(store.hasLoaded()).toBe(false);
  });

  it('should fetch languages successfully', async () => {
    const mockResponse = [
      { value: 'english', displayName: 'English' },
      { value: 'georgian', displayName: 'ქართული' },
    ];
    languageService.getAvailableLanguages.mockReturnValue(of(mockResponse));

    store.fetchLanguages({ force: false });

    await vi.waitFor(() => {
      expect(store.isLoading()).toBe(false);
    });

    expect(store.languages().length).toBe(2);
    expect(store.hasLoaded()).toBe(true);
  });

  it('should update language successfully', async () => {
    languageService.updateUserLanguage.mockReturnValue(of({ success: true }));

    store.updateLanguage('english').subscribe();

    await vi.waitFor(() => {
      expect(store.isLoading()).toBe(false);
    });

    expect(store.hasError()).toBe(false);
  });

  it('should reset state', () => {
    languageService.getAvailableLanguages.mockReturnValue(
      of([{ value: 'english', displayName: 'English' }]),
    );

    store.fetchLanguages({ force: false });
    store.resetState();

    expect(store.languages()).toEqual(initialState.languages);
    expect(store.isLoading()).toBe(false);
    expect(store.isRefreshing()).toBe(false);
    expect(store.hasError()).toBe(false);
    expect(store.hasLoaded()).toBe(false);
  });

  it('should not refetch when already loaded and force is false', async () => {
    const mockResponse = [
      { value: 'english', displayName: 'English' },
      { value: 'georgian', displayName: 'ქართული' },
    ];
    languageService.getAvailableLanguages.mockReturnValue(of(mockResponse));

    store.fetchLanguages({ force: false });

    await vi.waitFor(() => {
      expect(store.hasLoaded()).toBe(true);
    });

    store.fetchLanguages({ force: false });

    expect(languageService.getAvailableLanguages).toHaveBeenCalledTimes(1);
  });

  it('should refetch when force is true', async () => {
    const mockResponse = [
      { value: 'english', displayName: 'English' },
      { value: 'georgian', displayName: 'ქართული' },
    ];
    languageService.getAvailableLanguages.mockReturnValue(of(mockResponse));

    store.fetchLanguages({ force: false });

    await vi.waitFor(() => {
      expect(store.hasLoaded()).toBe(true);
    });

    store.fetchLanguages({ force: true });

    expect(languageService.getAvailableLanguages).toHaveBeenCalledTimes(2);
  });
});
