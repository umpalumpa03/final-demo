import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  OnInit,
  inject,
} from '@angular/core';
import { DragContainer } from '../../../../shared/lib/drag-n-drop/components/drag-container/drag-container';
import { DraggableCard } from '../../../../shared/lib/drag-n-drop/components/draggable-card/draggable-card';
import { DragItemDirective } from '../../../../shared/lib/drag-n-drop/directives/drag-item.directive';
import { IWidgetItem } from '../models/widgets.model';
import { WidgetTransactions } from '../components/widget-transactions/widget-transactions';
import { WidgetAccounts } from '../components/widget-accounts/widget-accounts';
import { WidgetExchange } from '../components/widget-exchange/widget-exchange';
import { LibraryTitle } from '../../../storybook/shared/library-title/library-title';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import { Store } from '@ngrx/store';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {
  clearExchangeRates,
  loadExchangeRates,
} from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.actions';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { Router } from '@angular/router';
import { BannerCarousel } from '../components/shared/ui/banner-carousel/banner-carousel';
import { bannerSlides } from '../config/banners.config';
import { CustomizeButton } from '../components/shared/ui/customize-button/customize-button';
import { UiSheetModal } from '@tia/shared/lib/overlay/ui-sheet-modal/ui-sheet-modal';
import { CustomizeCard } from '../components/shared/ui/customize-card/customize-card';
import { UserInfoActions } from 'apps/tia-frontend/src/app/store/user-info/user-info.actions';
import {
  selectWidgetsLoaded,
  selectWidgetsLoading,
} from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { DashboardService } from '../services/dashboard.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
@Component({
  selector: 'app-dashboard-container',
  imports: [
    DragContainer,
    DraggableCard,
    DragItemDirective,
    WidgetTransactions,
    WidgetAccounts,
    WidgetExchange,
    LibraryTitle,
    TranslateModule,
    BannerCarousel,
    CustomizeButton,
    UiSheetModal,
    CustomizeCard,
    Skeleton,
    RouteLoader,
  ],
  templateUrl: './dashboard-container.html',
  styleUrl: './dashboard-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardContainer implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly dashService = inject(DashboardService);
  private readonly breakpointService = inject(BreakpointService);

  protected readonly myItems = this.dashService.myItems;
  protected readonly widgetCatalog = this.dashService.widgetCatalog;
  protected readonly visibleItems = this.dashService.visibleItems;
  protected readonly isLoading = this.store.selectSignal(selectWidgetsLoading);

  protected readonly isCustomizing = signal(false);
  protected readonly bannerConfig = signal(bannerSlides);
  protected readonly gridColumns = computed(() => {
    const itemCount = this.visibleItems().length;
    const isVertical = this.breakpointService.isXsMobile() || itemCount < 3;

    return isVertical
      ? { default: 1, md: 1, sm: 1 }
      : { default: 2, md: 2, sm: 1 };
  });

  protected readonly isHeroMode = computed(
    () =>
      this.visibleItems().length >= 3 && !this.breakpointService.isXsMobile(),
  );

  protected readonly pageTitle = computed(() =>
    this.translate.instant('dashboard.page.title'),
  );
  protected readonly pageSubtitle = computed(() =>
    this.translate.instant('dashboard.page.subtitle'),
  );

  public openCustomization = () => this.isCustomizing.set(true);
  public closeCustomization = () => this.isCustomizing.set(false);

  public onItemsChange(items: IWidgetItem[]): void {
    this.dashService.updateItemsOnDrag(items);
  }

  public onFoldWidget(isSelected: boolean, id: string): void {
    this.dashService.foldWidget(isSelected, id);
  }

  public onToggleCatalogWidget(isSelected: boolean, id: string): void {
    this.dashService.toggleCatalogWidget(isSelected, id);
  }

  protected isWidgetActive(id: string): boolean {
    return this.myItems().some((w) => w.id === id);
  }

  public dynamicColspans = computed(() => {
    const items = this.visibleItems();
    const isVertical = this.breakpointService.isXsMobile() || items.length < 3;

    return items.map((_, index) => {
      if (isVertical) return 1;
      return index === 0 ? 2 : 1;
    });
  });

  public onWidgetRefresh(): void {
    this.store.dispatch(clearExchangeRates());
    this.store.dispatch(loadExchangeRates({ baseCurrency: 'USD' }));
  }

  public onWidgetAdd(): void {
    this.router.navigate(['/bank/products/accounts']);
  }

  public onPaginationChange(limit: number): void {
    this.store.dispatch(
      TransactionActions.updateFilters({ filters: { pageLimit: limit } }),
    );
    this.store.dispatch(
      TransactionActions.loadTransactions({ forceRefresh: true }),
    );
  }

  ngOnInit(): void {
    if (!this.store.selectSignal(selectWidgetsLoaded)()) {
      this.store.dispatch(UserInfoActions.loadWidgets({}));
    }
    this.store.dispatch(TransactionActions.enter());
    this.store.dispatch(loadExchangeRates({ baseCurrency: 'USD' }));
    this.store.dispatch(AccountsActions.loadAccounts({}));
  }
}
