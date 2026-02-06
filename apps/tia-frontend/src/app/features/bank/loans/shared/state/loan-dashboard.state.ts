import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LoanDashboardState {
  private readonly translate = inject(TranslateService);

  public allCfg = signal({
    title: this.translate.instant('loans.dashboard.empty.all.title'),
    message: this.translate.instant('loans.dashboard.empty.all.message'),
    button: this.translate.instant('loans.dashboard.empty.all.button'),
  });

  public pendingCfg = signal({
    title: this.translate.instant('loans.dashboard.empty.pending.title'),
    message: this.translate.instant('loans.dashboard.empty.pending.message'),
    button: this.translate.instant('loans.dashboard.empty.pending.button'),
  });

  public declinedCfg = signal({
    title: this.translate.instant('loans.dashboard.empty.declined.title'),
    message: this.translate.instant('loans.dashboard.empty.declined.message'),
    button: this.translate.instant('loans.dashboard.empty.declined.button'),
  });

  public approvedCfg = signal({
    title: this.translate.instant('loans.dashboard.empty.approved.title'),
    message: this.translate.instant('loans.dashboard.empty.approved.message'),
    button: this.translate.instant('loans.dashboard.empty.approved.button'),
  });

  public searchCfg = signal({
    placeholder: this.translate.instant('loans.dashboard.search'),
  });
}
