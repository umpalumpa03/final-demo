import { Component, input } from '@angular/core';
import { StatisticCardData } from '../models/card.model';

@Component({
  selector: 'app-statistic-card',
  imports: [],
  templateUrl: './statistic-card.html',
  styleUrl: './statistic-card.scss',
})
export class StatisticCard {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly change = input.required<string>();
  readonly changeType = input.required<'positive' | 'negative'>();
  readonly icon = input.required<string>();
}
