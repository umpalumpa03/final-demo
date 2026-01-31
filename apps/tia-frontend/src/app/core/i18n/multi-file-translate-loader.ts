import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const TRANSLATION_FILES = [
  'common',
  'auth',
  'dashboard',
  'loans',
  'my-finances',
  'transactions',
  'settings',
  'transfers',
  'paybill',
  'messaging',
  'my-products',
  'sidebar',
  'header-notifications',
] as const;

export class MultiFileTranslateLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private prefix = '/i18n/',
    private suffix = '.json',
  ) {}

  getTranslation(lang: string): Observable<TranslationObject> {
    const requests = TRANSLATION_FILES.map((file) =>
      this.http
        .get<TranslationObject>(`${this.prefix}${lang}/${file}${this.suffix}`)
        .pipe(
          map((translations) => ({ [file]: translations })),
          catchError((error) => {
            console.warn(
              `Translation file not found: ${lang}/${file}${this.suffix}`,
              error,
            );
            return of({ [file]: {} });
          }),
        ),
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

export function createMultiFileTranslateLoader(
  http: HttpClient,
): MultiFileTranslateLoader {
  return new MultiFileTranslateLoader(http, '/i18n/', '.json');
}
