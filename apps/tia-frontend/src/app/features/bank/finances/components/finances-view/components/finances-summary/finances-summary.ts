import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { StatisticCard } from '../../../../../../../shared/lib/cards/statistic-card/statistic-card';
import { Spinner } from '../../../../../../../shared/lib/feedback/spinner/spinner';
import { BasicAlerts } from '../../../../../../../shared/lib/alerts/components/basic-alerts/basic-alerts';
import { ButtonComponent } from '../../../../../../../shared/lib/primitives/button/button';
import { SummaryCard, FilterType } from '../../../../models/filter.model';

@Component({
  selector: 'app-finances-summary',
  imports: [StatisticCard, Spinner, BasicAlerts, ButtonComponent],
  templateUrl: './finances-summary.html',
  styleUrl: './finances-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancesSummary {
  public readonly loading = input<boolean>(false);
  public readonly error = input<string | null>(null);
  public readonly summaryCards = input<SummaryCard[]>([]);
  public readonly activeFilter = input<FilterType | null>(null);
  public readonly comparisonLabel = input<string>('');
  
  public readonly retry = output<FilterType>();
}