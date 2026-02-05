import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Language, LanguagesState } from '../models/language.model';

export const initialState: LanguagesState = {
  languages: [
    {
      id: 'english',
      name: 'English',
      nativeName: 'English',
      region: 'Global',
      speakerCount: '1.5B',
      flagUrl: 'assets/us.png',
    },
    {
      id: 'georgian',
      name: 'Georgian',
      nativeName: 'ქართული',
      region: 'Georgia & Caucasus',
      speakerCount: '4M',
      flagUrl: 'assets/ge.png',
    },
  ],
  isLoading: false,
  hasError: false,
};

export const LanguagesStore = signalStore(
  withState(initialState),
  withMethods((store) => {
    const languageService = inject(LanguageService);

    return {
      fetchLanguages: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, {
              isLoading: true,
              hasError: false,
            });
          }),
          switchMap(() => {
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
                      nativeName: languageData?.nativeName || lang.displayName,
                      region: languageData?.region || '',
                      speakerCount: languageData?.speakerCount || '',
                      flagUrl: languageData?.flagUrl || '',
                    };
                  });

                  patchState(store, {
                    languages: mappedLanguages,
                    isLoading: false,
                  });
                },
                error: () => {
                  patchState(store, {
                    hasError: true,
                    isLoading: false,
                  });
                },
              }),
            );
          }),
        ),
      ),

      updateLanguage: rxMethod<string>(
        pipe(
          tap(() => {
            patchState(store, {
              isLoading: true,
              hasError: false,
            });
          }),
          switchMap((language: string) => {
            return languageService.updateUserLanguage(language).pipe(
              tap({
                next: () => {
                  patchState(store, {
                    isLoading: false,
                  });
                },
                error: () => {
                  patchState(store, {
                    hasError: true,
                    isLoading: false,
                  });
                },
              }),
            );
          }),
        ),
      ),

      resetState(): void {
        patchState(store, initialState);
      },
    };
  }),
);
