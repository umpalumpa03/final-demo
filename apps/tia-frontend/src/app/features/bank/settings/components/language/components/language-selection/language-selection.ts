import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
  DestroyRef,
} from '@angular/core';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Language } from '../../models/language.model';
import { LanguageSelectionCard } from './language-selection-card/language-selection-card';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { LanguagesStore } from '../../store/languages.store';
import { TranslationLoaderService } from 'apps/tia-frontend/src/app/core/i18n';
import { LanguageInfo } from "./language-info/language-info";
import { AlertService } from '@tia/core/services/alert/alert.service';

@Component({
  selector: 'app-language-selection',
  imports: [
    LanguageSelectionCard,
    Skeleton,
    ErrorStates,
    ButtonComponent,
    TranslatePipe,
    LanguageInfo
],
  templateUrl: './language-selection.html',
  styleUrl: './language-selection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelection implements OnInit {
  private languagesStore = inject(LanguagesStore);
  private translateService = inject(TranslateService);
  public alertService = inject(AlertService);
  private destroyRef = inject(DestroyRef);
  private translationLoader = inject(TranslationLoaderService);

  public languages = input.required<Language[]>();
  public isLoading = input.required<boolean>();
  public hasError = input.required<boolean>();

  public selectedLanguage = signal<Language | null>(null);

  public ngOnInit(): void {
    const currentLang = this.translateService.getCurrentLang() || 'en';
    if (this.languages().length > 0) {
      const selected =
        this.languages().find((l) => l.value === currentLang) ||
        this.languages()[0];
      this.selectedLanguage.set(selected);
    }
  }

  public onLanguageSelect(language: Language): void {
    this.selectedLanguage.set(language);
  }

  public isLanguageSelected(language: Language): boolean {
    return this.selectedLanguage()?.id === language.id;
  }

  public onSave(): void {
    const selected = this.selectedLanguage();
    if (selected) {
      this.languagesStore
        .updateLanguage(selected.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.translationLoader.clearCache();

            this.translateService.use(selected.value).subscribe(() => {
              this.translationLoader
                .loadTranslations('settings')
                .pipe(
                  tap(() => {
                    this.alertService.success(this.translateService.instant('settings.language.saveSuccess'));
                  }),
                )
                .subscribe();
            });
          },
          error: () => {
            this.alertService.error(this.translateService.instant('settings.language.saveError'));
          },
        });
    }
  }
}
