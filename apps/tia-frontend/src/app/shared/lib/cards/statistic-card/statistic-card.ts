import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-statistic-card',
  imports: [],
  templateUrl: './statistic-card.html',
  styleUrl: './statistic-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticCard {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly change = input.required<string>();
  readonly changeType = input.required<'positive' | 'negative'>();
  readonly icon = input.required<string>();
}
