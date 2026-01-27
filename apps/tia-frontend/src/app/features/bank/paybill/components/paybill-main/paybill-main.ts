import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as PAYBILL_SELECTORS from '../../store/paybill.selectors';
import { PaybillActions } from '../../store/paybill.actions';
import { CategoryGrid } from './components/category-grid/category-grid';
import { CATEGORY_UI_MAP } from './components/category-grid/config/category.config';

@Component({
  selector: 'app-paybill-main',
  imports: [CategoryGrid],
  templateUrl: './paybill-main.html',
  styleUrl: './paybill-main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillMain {
  private readonly store = inject(Store);

  public readonly categories = this.store.selectSignal(
    PAYBILL_SELECTORS.selectCategories,
  );
  public readonly activeCategory = this.store.selectSignal(
    PAYBILL_SELECTORS.selectActiveCategory,
  );
  public readonly activeProvider = this.store.selectSignal(
    PAYBILL_SELECTORS.selectActiveProvider,
  );

  public readonly formattedCategories = computed(() => {
    return this.categories().map((cat) => {
      const lookupKey = cat.id.toLowerCase();

      const config = CATEGORY_UI_MAP[lookupKey] || {
        subtitle: 'Pay your bills',
        iconBgColor: '#F5F5F5',
      };

      return {
        ...cat,
        subtitle: config.subtitle,
        iconBgColor: config.iconBgColor,
        iconBgPath: config.iconBgPath,
        count: cat.providers?.length || 0,
      };
    });
  });

  public selectCategory(id: string): void {
    this.store.dispatch(PaybillActions.selectCategory({ categoryId: id }));
  }

  public selectProvider(id: string): void {
    this.store.dispatch(PaybillActions.selectProvider({ providerId: id }));
  }
}
