import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-statistic-card',
  imports: [],
  templateUrl: './statistic-card.html',
  styleUrl: './statistic-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticCard {
  public readonly label = input.required<string>();
  public readonly value = input.required<string>();
  public readonly change = input.required<string>();
  public readonly changeType = input.required<'positive' | 'negative'>();
  public readonly icon = input.required<string>();
  public readonly width = input<string>();
  public readonly height = input<string>();
  public readonly minWidth = input<string>();
  public readonly maxWidth = input<string>();
  public readonly hasTransition = input<boolean>(false);
  public readonly customTransition = input<string>('all 0.3s ease');
  public readonly transition = computed(() => {
    return this.hasTransition() ? this.customTransition() : 'none';
  });
}
