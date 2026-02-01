import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-category-card',
  imports: [],
  templateUrl: './category-card.html',
  styleUrl: './category-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCard {
  public readonly title = input<string>('');
  public readonly subtitle = input<string>('');
  public readonly icon = input<string>('');
  public readonly count = input<number>(0);
  public readonly cardClick = output<void>();
  public readonly iconBgColor = input<string>('');
  public readonly customWidth = input(true);

  protected handleClick(): void {
    this.cardClick.emit();
  }
}
