import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Language } from '../../models/language.model';
import { LanguageSelectionCard } from './language-selection-card/language-selection-card';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { LanguagesStore } from '../../store/languages.store';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@tia/shared/services/settings-language/alert.service';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';

@Component({
  selector: 'app-language-selection',
  imports: [
    LanguageSelectionCard,
    Skeleton,
    ErrorStates,
    ButtonComponent,
    AlertTypesWithIcons,
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
            this.translateService.use(selected.value);
            this.alertService.showAlert(
              'success',
              this.translateService.instant('settings.language.saveSuccess'),
            );
          },
          error: () => {
            this.alertService.showAlert(
              'error',
              this.translateService.instant('settings.language.saveError'),
            );
          },
        });
    }
  }
}
