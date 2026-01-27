import { Component, computed, input, output } from '@angular/core';
import { PaybillCategory } from '../../../../models/paybill.model';
import { CategoryCard } from '@tia/shared/lib/cards/category-card/category-card';
import { CATEGORY_UI_MAP } from './config/category.config';
import { GridLayout } from '@tia/shared/lib/layout/components/grid-layout/container/grid-layout';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';

@Component({
  selector: 'app-category-grid',
  imports: [CategoryCard, GridLayout, LibraryTitle],
  templateUrl: './category-grid.html',
  styleUrl: './category-grid.scss',
})
export class CategoryGrid {
  public categories = input.required<PaybillCategory[]>();

  public selected = output<string>();

  public onCategoryClick(id: string): void {
    this.selected.emit(id);
  }
}
