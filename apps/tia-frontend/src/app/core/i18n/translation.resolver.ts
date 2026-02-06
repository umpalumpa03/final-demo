import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import {
  TranslationLoaderService,
  TranslationModule,
} from './translation-loader.service';
import { Observable } from 'rxjs';

export function translationResolver(
  modules: TranslationModule | TranslationModule[],
): ResolveFn<void> {
  return (): Observable<void> => {
    const translationLoader = inject(TranslationLoaderService);
    return translationLoader.loadTranslations(modules);
  };
}
