import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CategoryGrid } from '../components/category-items/category-grid';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { CATEGORY_UI_MAP } from '../config/category.config';
import { Store } from '@ngrx/store';
import { PaybillActions } from '../../../../../store/paybill.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointService } from '@tia/core/services/breakpoints/breakpoint.service';
import { GridColumns } from '@tia/shared/lib/layout/components/grid-layout/container/grid-layout.model';

@Component({
  selector: 'app-category-grid-container',
  imports: [CategoryGrid],
  templateUrl: './category-grid-container.html',
  styleUrl: './category-grid-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryGridContainer {
  protected readonly facade = inject(PaybillMainFacade);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly breakpointService = inject(BreakpointService);

public readonly gridColumns = computed<GridColumns>(() => {
    if (this.breakpointService.isXsMobile()) {
      return '1';
    }
    if (this.breakpointService.isTablet()) {
      return '2';
    }
    return '4';
  });

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

  public selectCategory(categoryId: string): void {
    this.store.dispatch(PaybillActions.selectCategory({ categoryId }));
    this.router.navigate([categoryId], { relativeTo: this.route });
  }
}
