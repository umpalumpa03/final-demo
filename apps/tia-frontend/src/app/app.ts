import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RouteLoader } from './shared/lib/feedback/route-loader/route-loader';
import { NavigationService } from './core/services/navigation/navigation.service';
@Component({
  imports: [RouterModule, RouteLoader],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly translate = inject(TranslateService);
  private readonly navigationService = inject(NavigationService);
  protected readonly isLoading = this.navigationService.isFeatureLoading;

  constructor() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    if (savedLanguage === 'georgian' || savedLanguage === 'ka') {
      this.translate.use('ka');
    } else if(savedLanguage === 'english' || savedLanguage === 'en') {
      this.translate.use('en');
    }
  }
}
