import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-api.service';

@Component({
  selector: 'app-language-switcher',
  imports: [],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);
  private destroyRef = inject(DestroyRef);

  public readonly languages = [
    { code: 'en', value: 'english', label: 'English', flag: '🇬🇧' },
    { code: 'ka', value: 'georgian', label: 'ქართული', flag: '🇬🇪' },
  ];

  public currentLanguage = signal('en');
  public isOpen = signal(false);

  constructor() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    if (savedLanguage === 'georgian' || savedLanguage === 'ka') {
      this.currentLanguage.set('ka');
      this.translate.use('ka');
    } else if (savedLanguage === 'english' || savedLanguage === 'en') {
      this.currentLanguage.set('en');
      this.translate.use('en');
    }
  }

  public toggleDropdown(): void {
    this.isOpen.update((open) => !open);
  }

  public closeDropdown(): void {
    this.isOpen.set(false);
  }

  public switchLanguage(languageCode: string): void {
    const langCodeForApi = languageCode === 'ka' ? 'georgian' : 'english';
    const subscription = this.languageService
      .updateUserLanguage(langCodeForApi)
      .subscribe();
    this.destroyRef.onDestroy(() => subscription.unsubscribe());

    this.currentLanguage.set(languageCode);
    this.translate.use(languageCode);
    localStorage.setItem('language', languageCode);
    this.closeDropdown();
  }

  public getCurrentLanguage() {
    return this.languages.find((lang) => lang.code === this.currentLanguage());
  }
}
