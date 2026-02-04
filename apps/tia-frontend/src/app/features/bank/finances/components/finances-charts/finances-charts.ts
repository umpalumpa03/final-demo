import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Spinner } from '../../../../../shared/lib/feedback/spinner/spinner';
import { ChartConfig } from '../../models/filter.model';
import { ChartOptions } from 'chart.js';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-finances-charts',
  imports: [CommonModule, BaseChartDirective, Spinner],
  templateUrl: './finances-charts.html',
  styleUrl: './finances-charts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancesCharts {
  public readonly charts = input.required<ChartConfig[]>();

  public readonly chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
  };
}