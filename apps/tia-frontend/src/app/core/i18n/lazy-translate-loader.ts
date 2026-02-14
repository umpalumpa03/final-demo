import { HttpBackend, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
 
const CORE_TRANSLATION_FILES = [
  'common',
  'auth',
  'sidebar',
  'header-notifications',
  'storybook',
] as const;
 
export class LazyTranslateLoader implements TranslateLoader {
  private http: HttpClient;
 
  constructor(
    httpBackend: HttpBackend,
    private prefix = '/i18n/',
    private suffix = '.json',
  ) {
    this.http = new HttpClient(httpBackend);
  }
 
  getTranslation(lang: string): Observable<TranslationObject> {
    const requests = CORE_TRANSLATION_FILES.map((file) =>
      this.http
        .get<TranslationObject>(`${this.prefix}${lang}/${file}${this.suffix}`)
        .pipe(map((translations) => ({ [file]: translations }))),
    );
 
    return forkJoin(requests).pipe(
      catchError((err) => {
        console.warn('error:', err);
        return of([]);
      }),
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
  httpBackend: HttpBackend,
): LazyTranslateLoader {
  return new LazyTranslateLoader(httpBackend, '/i18n/', '.json');
}
 
 