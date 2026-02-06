import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CategoryItem } from '../../../../../../../shared/lib/categories/category-item';
import { CategoryBreakdown } from '../../../../models/filter.model';

@Component({
  selector: 'app-finances-breakdown',
  imports: [CategoryItem],
  templateUrl: './finances-breakdown.html',
  styleUrl: './finances-breakdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancesBreakdown {
  public readonly categories = input<CategoryBreakdown[]>([]);
  public readonly loading = input<boolean>(false);
}