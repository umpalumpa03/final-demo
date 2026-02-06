import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService, TranslationObject } from '@ngx-translate/core';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { TranslationModule } from './model';


@Injectable({
  providedIn: 'root',
})
export class TranslationLoaderService {
  private readonly http = inject(HttpClient);
  private readonly translate = inject(TranslateService);
  private readonly loadedModules = new Set<string>();

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
      this.http
        .get<TranslationObject>(`/i18n/${currentLang}/${module}.json`)
        .pipe(
          tap((translations) => {
            this.translate.setTranslation(
              currentLang,
              { [module]: translations } as TranslationObject,
              true,
            );
            this.loadedModules.add(`${currentLang}-${module}`);
          }),
        ),
    );

    return forkJoin(requests).pipe(map(() => void 0));
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
