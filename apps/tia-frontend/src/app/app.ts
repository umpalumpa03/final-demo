import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  effect,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RouteLoader } from './shared/lib/feedback/route-loader/route-loader';
import { NavigationService } from './core/services/navigation/navigation.service';
import { NoConnection } from './features/no-connection/container/no-connection';
import { GlobalAlert } from './shared/ui/global-alert/global-alert';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { TranslationLoaderService } from './core/i18n';
@Component({
  imports: [RouterModule, RouteLoader, NoConnection, GlobalAlert],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly translate = inject(TranslateService);
  private readonly navigationService = inject(NavigationService);
  protected readonly isLoading = this.navigationService.isFeatureLoading;
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translationLoader = inject(TranslationLoaderService);
  private readonly userLanguage = inject(Store).selectSignal(
    (state) => state['user-info'].language,
  );

  constructor() {
    this.translate.onLangChange
      .pipe(
        tap((event) => {
          this.updateHtmlLang(event.lang);
        }),
        switchMap((event) => {
          const activeModules = this.translationLoader.getActiveModules();
          if (activeModules.length === 0) {
            return EMPTY;
          }
          return this.translationLoader.loadTranslations(
            activeModules,
            event.lang,
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    effect(() => {
      const savedLanguage = this.userLanguage();
      if (!savedLanguage) {
        return;
      }
      const langToUse =
        savedLanguage === 'georgian' || savedLanguage === 'ka' ? 'ka' : 'en';
      const currentLang = this.translate.getCurrentLang();
      if (currentLang !== langToUse) {
        this.translate.use(langToUse);
        this.updateHtmlLang(langToUse);
      }
    });
  }

  private updateHtmlLang(lang: string): void {
    this.document.documentElement.lang = lang;
  }
}
