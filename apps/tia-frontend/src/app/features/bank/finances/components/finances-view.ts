import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LibraryTitle } from '../../../storybook/shared/library-title/library-title';
import { ButtonComponent } from '../../../../shared/lib/primitives/button/button';
import { TextInput } from '../../../../shared/lib/forms/input-field/text-input';
import { BasicAlerts } from '../../../../shared/lib/alerts/components/basic-alerts/basic-alerts';
import { StatisticCard } from '../../../../shared/lib/cards/statistic-card/statistic-card';
import { Spinner } from '../../../../shared/lib/feedback/spinner/spinner';
import { ChartConfig, FilterOption, FilterType, SummaryCard } from '../models/filter.model';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-finances-view',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LibraryTitle,
    ButtonComponent,
    TextInput,
    BasicAlerts,
    StatisticCard,
    Spinner,
    BaseChartDirective
  ],
  templateUrl: './finances-view.html',
  styleUrl: './finances-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancesView {
  public readonly financeTitle = input.required<string>();
  public readonly financeSubTitle = input.required<string>();
  public readonly activeFilter = input.required<string>();
  public readonly filterOptions = input.required<FilterOption[]>();
  public readonly filterForm = input.required<FormGroup>();
  public readonly loading = input<boolean>(false);
  public readonly error = input<string | null>(null);
  public readonly summaryCards = input<SummaryCard[]>([]);

  public readonly filterChange = output<FilterType>();
  public readonly dateInput = output<{ field: 'fromDate' | 'toDate'; event: Event }>();

  public readonly categoryChartData = input<ChartData<'pie'>>(); 
  public readonly mainChartData = input<ChartData<'line'>>();    
  public readonly savingsChartData = input<ChartData<'line'>>();  
  public readonly dailyChartData = input<ChartData<'bar'>>();

  public readonly chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  public readonly charts = computed<ChartConfig[]>(() => [
    { 
      title: 'Income vs Expenses', 
      type: 'line', 
      data: this.mainChartData() 
    },
    { 
      title: 'Spending by Category', 
      type: 'pie', 
      data: this.categoryChartData() 
    },
    { 
      title: 'Savings Trend', 
      type: 'line', 
      data: this.savingsChartData() 
    },
    { 
      title: 'Daily Spending', 
      type: 'bar', 
      data: this.dailyChartData() 
    }
  ]);

  public getControl(name: string): FormControl {
    return this.filterForm().get(name) as FormControl;
  }

  public get isRangeInvalid(): boolean {
    return this.filterForm().hasError('dateRangeInvalid') && this.filterForm().touched;
  }

  public get isToDateInvalid(): boolean {
    const control = this.filterForm().get('toDate');
    return !!(control?.touched && control?.invalid);
  }

  public get isFromDateInvalid(): boolean {
    const control = this.filterForm().get('fromDate');
    return !!(control?.touched && control?.invalid);
  }
}