import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FinancesFilters } from '../components/finances-filters/finances-filters';
import { FinancesSummary } from '../components/finances-summary/finances-summary';
import { FinancesCharts } from '../components/finances-charts/finances-charts';
import { FinancesBreakdown } from '../components/finances-breakdown/finances-breakdown';
import { FinancesTransactions } from '../components/finances-transactions/finances-transactions';
import {RouteLoader} from "../../../../../../shared/lib/feedback/route-loader/route-loader";
import { LibraryTitle } from '../../../../../storybook/shared/library-title/library-title';

import {
  FilterOption,
  FilterType,
  SummaryCard,
  ChartConfig,
  CategoryBreakdown,
  Transaction,
  SelectOption,
  DailySpendingFooter,
  SavingsFooter,
  IncomeVsExpensesFooter,
  TopCategoryFooter,
} from '../../../models/filter.model';

@Component({
  selector: 'app-finances-view',
  imports: [
    ReactiveFormsModule,
    LibraryTitle,
    FinancesFilters,
    FinancesSummary,
    FinancesCharts,
    FinancesBreakdown,
    FinancesTransactions,
    RouteLoader
  ],
  templateUrl: './finances-view.html',
  styleUrl: './finances-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancesView {
  public readonly financeTitle = input.required<string>();
  public readonly financeSubTitle = input.required<string>();

  public readonly activeFilter = input.required<FilterType | null>();
  public readonly filterOptions = input.required<FilterOption[]>();
  public readonly filterForm = input.required<FormGroup>();
  public readonly monthOptions = input<SelectOption[]>([]);

  public readonly charts = input.required<ChartConfig[]>();
  public readonly categories = input<CategoryBreakdown[]>([]);
  public readonly transactions = input<Transaction[]>([]);
  public readonly summaryCards = input<SummaryCard[]>([]);

  public readonly incomeVsExpensesFooter = input<IncomeVsExpensesFooter | null>(null);
  public readonly topCategoriesFooter = input<TopCategoryFooter[]>([]);
  public readonly savingsFooter = input<SavingsFooter | null>(null);
  public readonly dailySpendingFooter = input<DailySpendingFooter | null>(null);

  public readonly loading = input<boolean>(false);
  public readonly error = input<string | null>(null);
  public readonly isRefreshing = input<boolean>(false);
  public readonly update = output<void>();

  public readonly filterChange = output<FilterType>();
}