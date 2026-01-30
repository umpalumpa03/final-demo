import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { TabItem } from '@tia/shared/lib/navigation/models/tab.model';
import { Tabs } from '@tia/shared/lib/navigation/tabs/tabs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectLoanCounts } from '../../../store/loans.selectors';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-loan-navigation',
  imports: [Tabs],
  templateUrl: './loan-navigation.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanNavigation {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);

  private readonly counts = toSignal(this.store.select(selectLoanCounts), {
    initialValue: { all: 0, approved: 0, pending: 0, declined: 0 },
  });

  private readonly langChange = toSignal(this.translate.onLangChange, {
    initialValue: null,
  });

  protected readonly tabs = computed<TabItem[]>(() => {
    const c = this.counts();
    this.langChange();

    const t = (key: string) => this.translate.instant(key);

    return [
      {
        label: `${t('loans.dashboard.all').trim()} (${c.all})`,
        route: 'all',
      },
      {
        label: `${t('loans.dashboard.approved').trim()} (${c.approved})`,
        route: 'approved',
      },
      {
        label: `${t('loans.dashboard.pending').trim()} (${c.pending})`,
        route: 'pending',
      },
      {
        label: `${t('loans.dashboard.declined').trim()} (${c.declined})`,
        route: 'declined',
      },
    ];
  });
}
