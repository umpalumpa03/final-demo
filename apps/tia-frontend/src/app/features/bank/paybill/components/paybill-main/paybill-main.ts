import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as PAYBILL_SELECTORS from '../../store/paybill.selectors';
import { CategoryGrid } from './components/category-grid/category-grid';
import { CATEGORY_UI_MAP } from './components/category-grid/config/category.config';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderList } from './components/provider-list/provider-list';
import { PaybillForm } from '../paybill-form/paybill-form';

@Component({
  selector: 'app-paybill-main',
  imports: [CategoryGrid, ProviderList, PaybillForm],
  templateUrl: './paybill-main.html',
  styleUrl: './paybill-main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillMain {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly activeCategory = this.store.selectSignal(
    PAYBILL_SELECTORS.selectActiveCategory,
  );
  public readonly activeProvider = this.store.selectSignal(
    PAYBILL_SELECTORS.selectActiveProvider,
  );
  public readonly categories = this.store.selectSignal(
    PAYBILL_SELECTORS.selectCategories,
  );

  public readonly isLoading = this.store.selectSignal(
    PAYBILL_SELECTORS.selectLoading,
  );

  public readonly formattedCategories = computed(() => {
    return this.categories().map((cat) => {
      const lookupKey = cat.id.toLowerCase();

      const config = CATEGORY_UI_MAP[lookupKey] || {
        iconBgColor: '#F5F5F5',
      };

      return {
        ...cat,
        iconBgColor: config.iconBgColor,
        iconBgPath: config.iconBgPath,
        count: cat.providers?.length || 0,
      };
    });
  });

  public selectCategory(categoryId: string): void {
    this.router.navigate([categoryId.toLowerCase()], {
      relativeTo: this.route,
    });
  }

  public selectProvider(providerId: string): void {
    const category = this.activeCategory();

    if (category?.id && providerId) {
      const catId = category.id.toLowerCase();
      const provId = providerId.toLowerCase();

      this.router.navigate([catId, provId], {
        relativeTo: this.route.parent,
      });
    }
  }

  public readonly activeCategoryUI = computed(() => {
    const cat = this.activeCategory();
    if (!cat) return null;
    return CATEGORY_UI_MAP[cat.id.toLowerCase()];
  });

  public verifyAccount(data: { accountNumber: string }): void {
    console.log('Account Number submitted:', data.accountNumber);
  }
}
