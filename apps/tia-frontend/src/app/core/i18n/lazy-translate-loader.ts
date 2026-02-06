import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const CORE_TRANSLATION_FILES = [
  'common',
  'auth',
  'sidebar',
  'header-notifications',
] as const;

export class LazyTranslateLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private prefix = '/i18n/',
    private suffix = '.json',
  ) {}

  getTranslation(lang: string): Observable<TranslationObject> {
    const requests = CORE_TRANSLATION_FILES.map((file) =>
      this.http
        .get<TranslationObject>(`${this.prefix}${lang}/${file}${this.suffix}`)
        .pipe(map((translations) => ({ [file]: translations }))),
    );

    return forkJoin(requests).pipe(
      map((results) =>
        results.reduce<TranslationObject>(
          (acc, curr) => ({ ...acc, ...curr }),
          {},
        ),
      ),
    );
  }
}

export function createLazyTranslateLoader(
  http: HttpClient,
): LazyTranslateLoader {
  return new LazyTranslateLoader(http, '/i18n/', '.json');
}
