import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RouteLoader } from './shared/lib/feedback/route-loader/route-loader';
import { NavigationService } from './core/services/navigation/navigation.service';
import { GlobalAlert } from '@tia/shared/ui/global-alert/global-alert';
@Component({
  imports: [RouterModule, RouteLoader, GlobalAlert],
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
  constructor() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    const langToUse =
      savedLanguage === 'georgian' || savedLanguage === 'ka' ? 'ka' : 'en';

    this.translate.use(langToUse);
    this.updateHtmlLang(langToUse);

    this.translate.onLangChange.subscribe((event) => {
      this.updateHtmlLang(event.lang);
    });
  }

  private updateHtmlLang(lang: string): void {
    this.document.documentElement.lang = lang;
  }
}
