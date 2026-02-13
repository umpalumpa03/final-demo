import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { LanguageService } from '../services/language-api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  pipe,
  switchMap,
  tap,
  catchError,
  of,
  Observable,
  EMPTY,
  exhaustMap,
} from 'rxjs';
import { Language, LanguagesState } from '../models/language.model';

export const initialState: LanguagesState = {
  languages: [
    {
      id: 'english',
      value: 'en',
      name: 'English',
      nativeName: 'English',
      region: 'settings.language.languages.en.location',
      speakerCount: 'settings.language.languages.en.speakers',
      flagUrl: 'images/png/settings/us-flag.png',
    },
    {
      id: 'georgian',
      value: 'ka',
      name: 'Georgian',
      nativeName: 'ქართული',
      region: 'settings.language.languages.ka.location',
      speakerCount: 'settings.language.languages.ka.speakers',
      flagUrl: 'images/png/settings/ge-flag.png',
    },
  ],
  isLoading: false,
  isRefreshing: false,
  hasError: false,
  hasLoaded: false,
};

export const LanguagesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const languageService = inject(LanguageService);

    return {
      fetchLanguages: rxMethod<{ force?: boolean }>(
        pipe(
          tap(({ force }) => {
            if (force) {
              patchState(store, { isRefreshing: true, hasError: false });
            } else {
              patchState(store, { isLoading: true, hasError: false });
            }
          }),
          exhaustMap(({ force }) => {
            if (!force && store.hasLoaded()) {
              patchState(store, { isLoading: false, isRefreshing: false });
              return EMPTY;
            }

            return languageService.getAvailableLanguages().pipe(
              tap({
                next: (response) => {
                  const mappedLanguages: Language[] = response.map((lang) => {
                    const languageData = initialState.languages.find(
                      (l) => l.id === lang.value,
                    );
                    return {
                      id: lang.value,
                      name: lang.displayName,
                      value: lang.value === 'georgian' ? 'ka' : 'en',
                      nativeName: languageData?.nativeName || lang.displayName,
                      region: languageData?.region || '',
                      speakerCount: languageData?.speakerCount || '',
                      flagUrl: languageData?.flagUrl || '',
                    };
                  });

                  patchState(store, {
                    languages: mappedLanguages,
                    isLoading: false,
                    isRefreshing: false,
                    hasLoaded: true,
                  });
                },
                error: () => {
                  patchState(store, {
                    hasError: true,
                    isLoading: false,
                    isRefreshing: false,
                  });
                },
              }),
            );
          }),
        ),
      ),

      updateLanguage(language: string): Observable<void> {
        patchState(store, {
          isLoading: true,
          hasError: false,
        });

        return languageService.updateUserLanguage(language).pipe(
          tap(() => {
            patchState(store, {
              isLoading: false,
              hasError: false,
            });
          }),
          catchError(() => {
            patchState(store, {
              hasError: true,
              isLoading: false,
            });
            throw new Error('Failed to update language');
          }),
          switchMap(() => of(void 0)),
        );
      },

      resetState(): void {
        patchState(store, initialState);
      },
    };
  }),
);
