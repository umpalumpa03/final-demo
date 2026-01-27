import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  private translate = inject(TranslateService);

  public readonly languages = [
    { code: 'en', value: 'english', label: 'English', flag: '🇬🇧' },
    { code: 'ka', value: 'georgian', label: 'ქართული', flag: '🇬🇪' },
  ];

  public currentLanguage = signal('en');
  public isOpen = signal(false);

  constructor() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      this.currentLanguage.set(savedLanguage);
      this.translate.use(savedLanguage);
    }
  }

  public toggleDropdown(): void {
    this.isOpen.update((open) => !open);
  }

  public closeDropdown(): void {
    this.isOpen.set(false);
  }

  public switchLanguage(languageCode: string): void {
    this.currentLanguage.set(languageCode);
    this.translate.use(languageCode);
    localStorage.setItem('language', languageCode);
    this.closeDropdown();
  }

  public getCurrentLanguage() {
    return this.languages.find((lang) => lang.code === this.currentLanguage());
  }
}
