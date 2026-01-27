import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { TabItem } from '@tia/shared/lib/navigation/models/tab.model';
import { Tabs } from '@tia/shared/lib/navigation/tabs/tabs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectLoanCounts } from '../../../store/loans.selectors';

@Component({
  selector: 'app-loan-navigation',
  imports: [Tabs],
  templateUrl: './loan-navigation.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanNavigation {
  private readonly store = inject(Store);

  private readonly counts = toSignal(this.store.select(selectLoanCounts), {
    initialValue: { all: 0, approved: 0, pending: 0, declined: 0 },
  });

  protected readonly tabs = computed<TabItem[]>(() => {
    const c = this.counts();
    return [
      { label: `All Loans (${c.all})`, route: 'all' },
      { label: `Approved (${c.approved})`, route: 'approved' },
      { label: `Pending (${c.pending})`, route: 'pending' },
      { label: `Declined (${c.declined})`, route: 'declined' },
    ];
  });
}
