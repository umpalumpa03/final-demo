import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CategoryGrid } from '../components/category-items/category-grid';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { CATEGORY_UI_MAP } from '../config/category.config';

@Component({
  selector: 'app-category-grid-container',
  imports: [CategoryGrid],
  templateUrl: './category-grid-container.html',
  styleUrl: './category-grid-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryGridContainer {
  protected readonly facade = inject(PaybillMainFacade);

  public readonly formattedCategories = computed(() => {
    const query = this.facade.searchQuery().toLowerCase().trim();
    let cats = this.facade.categories().map((cat) => {
      const lookupKey = cat.id.toLowerCase();
      const config = CATEGORY_UI_MAP[lookupKey] || { iconBgColor: '#F5F5F5' };
      return {
        ...cat,
        iconBgColor: config.iconBgColor,
        iconBgPath: config.iconBgPath,
        count: cat.providers?.length || 0,
      };
    });

    if (query) {
      cats = cats.filter((c) => c.name.toLowerCase().includes(query));
    }
    return cats;
  });
}
