import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Spinner } from '../../../../../shared/lib/feedback/spinner/spinner';
import { ChartConfig, DailySpendingFooter, IncomeVsExpensesFooter, SavingsFooter, SelectOption, TopCategoryFooter } from '../../models/filter.model';
import { ChartOptions } from 'chart.js';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-finances-charts',
  imports: [CommonModule, BaseChartDirective, Spinner],
  templateUrl: './finances-charts.html',
  styleUrl: './finances-charts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancesCharts {
  public readonly charts = input.required<ChartConfig[]>();

  public readonly incomeVsExpensesFooter = input<IncomeVsExpensesFooter | null>(null);
  public readonly topCategoriesFooter = input<TopCategoryFooter[]>([]);
  public readonly savingsFooter = input<SavingsFooter | null>(null);
  public readonly dailySpendingFooter = input<DailySpendingFooter | null>(null);

  public readonly monthOptions = input<SelectOption[]>([]);
  public readonly selectedMonthValue = input<string | number | null>(null);

  public readonly selectedMonthLabel = computed(() => {
    const options = this.monthOptions();
    const value = this.selectedMonthValue();
    const found = options.find(opt => opt.value === value);
    return found ? found.label : 'Current Month';
  });

  public readonly chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom',
        labels: { usePointStyle: true, padding: 20 }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: {autoSkip: true, maxTicksLimit:31} },
      y: { border: { display: false }, grid: { color: '#f1f5f9' } }
    }
  };

  
}