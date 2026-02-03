import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { PaybillCategory } from '../../../../shared/models/paybill.model';
import { CategoryCard } from '@tia/shared/lib/cards/category-card/category-card';
import { GridLayout } from '@tia/shared/lib/layout/components/grid-layout/container/grid-layout';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';

@Component({
  selector: 'app-category-grid',
  imports: [CategoryCard, GridLayout, LibraryTitle, Skeleton],
  templateUrl: './category-grid.html',
  styleUrl: './category-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryGrid {
  public categories = input.required<PaybillCategory[]>();
  public isLoading = input<boolean>(false);

  public selected = output<string>();

  public onCategoryClick(id: string): void {
    this.selected.emit(id);
  }
}
