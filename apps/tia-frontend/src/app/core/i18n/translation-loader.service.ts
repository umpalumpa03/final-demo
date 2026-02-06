import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService, TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export type TranslationModule =
  | 'auth'
  | 'dashboard'
  | 'loans'
  | 'my-finances'
  | 'transactions'
  | 'settings'
  | 'transfers'
  | 'paybill'
  | 'messaging'
  | 'my-products';

@Injectable({
  providedIn: 'root',
})
export class TranslationLoaderService {
  private http = inject(HttpClient);
  private translate = inject(TranslateService);
  private loadedModules = new Set<string>();

  public loadTranslations(
    modules: TranslationModule | TranslationModule[],
    lang?: string,
  ): Observable<void> {
    const currentLang = lang || this.translate.getCurrentLang() || 'en';
    const moduleArray = Array.isArray(modules) ? modules : [modules];

    const modulesToLoad = moduleArray.filter(
      (module) => !this.loadedModules.has(`${currentLang}-${module}`),
    );

    if (modulesToLoad.length === 0) {
      return of(void 0);
    }

    const requests = modulesToLoad.map((module) =>
      this.http.get<TranslationObject>(`/i18n/${currentLang}/${module}.json`).pipe(
        tap((translations) => {
          this.translate.setTranslation(
            currentLang,
            { [module]: translations } as TranslationObject,
            true,
          );
          this.loadedModules.add(`${currentLang}-${module}`);
        }),
        catchError((error) => {
          console.warn(
            `Failed to load translation module: ${currentLang}/${module}`,
            error,
          );
          return of(null);
        }),
      ),
    );

    return new Observable((observer) => {
      Promise.all(requests.map((req) => req.toPromise())).then(
        () => {
          observer.next();
          observer.complete();
        },
        (error) => {
          observer.error(error);
        },
      );
    });
  }

  public preloadModules(modules: TranslationModule[]): Observable<void> {
    return this.loadTranslations(modules);
  }

  public clearCache(): void {
    this.loadedModules.clear();
  }

  public isModuleLoaded(module: TranslationModule, lang?: string): boolean {
    const currentLang = lang || this.translate.currentLang || 'en';
    return this.loadedModules.has(`${currentLang}-${module}`);
  }
}
