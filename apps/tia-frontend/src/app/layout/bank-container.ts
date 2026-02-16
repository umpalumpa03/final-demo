import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { BankHeaderContainer } from 'apps/tia-frontend/src/app/layout/ui/bank-header/container/bank-header-container';
import { Sidebar } from './ui/sidebar/container/sidebar';
import { MonitorInactivity } from '../core/auth/services/monitor-inacticity.service';
import { LibraryTitle } from '../features/storybook/shared/library-title/library-title';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { NavigationService } from 'apps/tia-frontend/src/app/core/services/navigation/navigation.service';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { PersonalInfoActions } from '../store/personal-info/pesronal-info.actions';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslationLoaderService } from '../core/i18n';

@Component({
  selector: 'app-bank-container',
  imports: [
    Sidebar,
    RouterModule,
    BankHeaderContainer,
    LibraryTitle,
    UiModal,
    RouteLoader,
  ],
  templateUrl: './bank-container.html',
  styleUrl: './bank-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankContainer {
  private monitorInactivity = inject(MonitorInactivity);
  private readonly navigationService = inject(NavigationService);
  private readonly translationLoader = inject(TranslationLoaderService);
  private readonly destroyRef = inject(DestroyRef);

  public modalTitle = 'Inactivity Detected!';
  public subtitle = 'You will be automatically logged out in';
  public timeWarning = this.monitorInactivity.timeWarning;
  protected readonly isLoading = this.navigationService.isChangingAtSegment(2);

  private readonly document = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);
  private readonly userLanguage = inject(Store).selectSignal(
    (state) => state['user-info'].language,
  );

  constructor() {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        this.updateHtmlLang(event.lang);
        const activeModules = this.translationLoader.getActiveModules();
        if (activeModules.length > 0) {
          this.translationLoader
            .loadTranslations(activeModules, event.lang)
            .subscribe();
        }
      });

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
