import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserActivityService } from './core/auth/services/user-activity.service';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  protected title = 'tia-frontend';

  private translate = inject(TranslateService);
  private userActivityService = inject(UserActivityService);

  constructor() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    this.translate.use(savedLanguage);
  }

  ngOnInit(): void {
    this.userActivityService.startMonitoring();
  }
}
