import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import {
  TranslationLoaderService,
} from './translation-loader.service';
import { Observable } from 'rxjs';
import { TranslationModule } from './model';

export function translationResolver(
  modules: TranslationModule | TranslationModule[],
): ResolveFn<void> {
  return (): Observable<void> => {
    const translationLoader = inject(TranslationLoaderService);
    return translationLoader.loadTranslations(modules);
  };
}
