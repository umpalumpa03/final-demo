import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  OnInit,
  inject,
  effect,
} from '@angular/core';
import { DragContainer } from '../../../../shared/lib/drag-n-drop/components/drag-container/drag-container';
import { DraggableCard } from '../../../../shared/lib/drag-n-drop/components/draggable-card/draggable-card';
import { DragItemDirective } from '../../../../shared/lib/drag-n-drop/directives/drag-item.directive';
import { IWidgetItem } from '../models/widgets.model';
import { WidgetTransactions } from '../components/widget-transactions/widget-transactions';
import { WidgetAccounts } from '../components/widget-accounts/widget-accounts';
import { WidgetExchange } from '../components/widget-exchange/widget-exchange';
import { catalog, widgetItems } from '../config/widgets.config';
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
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { BannerCarousel } from '../components/shared/ui/banner-carousel/banner-carousel';
import { bannerSlides } from '../config/banners.config';
import { CustomizeButton } from '../components/shared/ui/customize-button/customize-button';
import { UiSheetModal } from '@tia/shared/lib/overlay/ui-sheet-modal/ui-sheet-modal';
import { CustomizeCard } from '../components/shared/ui/customize-card/customize-card';
import { WidgetsService } from '../services/widgets-service';
import { UserInfoActions } from 'apps/tia-frontend/src/app/store/user-info/user-info.actions';
import {
  selectUserWidgets,
  selectWidgetsLoaded,
  selectWidgetsLoading,
} from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { debounceTime, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouteLoader } from "@tia/shared/lib/feedback/route-loader/route-loader";
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
    RouteLoader
],
  templateUrl: './dashboard-container.html',
  styleUrl: './dashboard-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardContainer implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly breakpointService = inject(BreakpointService);
  protected readonly isLoading = this.store.selectSignal(selectWidgetsLoading);

  protected readonly isCustomizing = signal(false);
  protected readonly widgetCatalog = signal(catalog);

  private readonly updateStream$ = new Subject<IWidgetItem[]>();
  private dirtyIds = new Set<string>();

  constructor() {
    this.updateStream$
      .pipe(
        debounceTime(1000),
        takeUntilDestroyed(),
        tap((allWidgets) => {
          this.persistChanges(allWidgets);
        }),
      )
      .subscribe();
  }

  protected readonly visibleItems = computed(() =>
    this.myItems().filter((item, index) => index === 0 || !item.isHidden),
  );

  public openCustomization(): void {
    this.isCustomizing.set(true);
  }

  public closeCustomization(): void {
    this.isCustomizing.set(false);
  }

  protected readonly myItems = signal<IWidgetItem[]>([]);
  protected readonly bannerConfig = signal(bannerSlides);

  protected readonly pageTitle = computed(() =>
    this.translate.instant('dashboard.page.title'),
  );

  protected readonly pageSubtitle = computed(() =>
    this.translate.instant('dashboard.page.subtitle'),
  );

  protected isWidgetActive(id: string): boolean {
    const activeWidget = this.myItems().find((w) => w.id === id);
    return !!activeWidget && !activeWidget.isHidden;
  }
  public dynamicColspans = computed(() => {
    const items = this.visibleItems();
    const isMobile = this.breakpointService.isMobile();

    if (isMobile) {
      return items.map(() => 2);
    }
    return items.map((_, index) => (index === 0 ? 2 : 1));
  });
  public onItemsChange(reorderedVisibleItems: IWidgetItem[]): void {
    const visibleIds = new Set(reorderedVisibleItems.map((i) => i.id));
    const hiddenItems = this.myItems().filter(
      (item) => !visibleIds.has(item.id),
    );

    const newVisibleList = reorderedVisibleItems.map((item, index) => ({
      ...item,
      order: index + 1,
      hasFullWidth: index === 0,
      isHidden: index === 0 ? item.isHidden : false,
    }));

    newVisibleList.forEach((item) => this.dirtyIds.add(item.id));

    const newMasterList = [...newVisibleList, ...hiddenItems];

    this.store.dispatch(
      UserInfoActions.loadWidgetsSuccess({ widgets: newMasterList }),
    );
    this.myItems.set(newMasterList);
    this.updateStream$.next(newMasterList);
  }

  private persistChanges(allWidgets: IWidgetItem[]): void {
    const updates = allWidgets

      .filter((item) => !!item.dbId && this.dirtyIds.has(item.id))
      .map((item, index) => ({
        id: item.dbId!,
        updates: {
          order: item.order,
          hasFullWidth: item.hasFullWidth,

          isHidden: !!item.isHidden,
          widgetName:
            this.widgetCatalog().find((c) => c.id === item.id)?.title ||
            item.title,
        },
      }));

    this.dirtyIds.clear();

    if (updates.length > 0) {
      this.store.dispatch(UserInfoActions.updateWidgetsBulk({ updates }));
    }
  }

  private readonly syncWidgets = effect(() => {
    const storeWidgets = this.store.selectSignal(selectUserWidgets)();
    this.myItems.set(storeWidgets);
  });

  public onContainerOrderChange(ids: string[]): void {}

  public onFoldWidget(isSelected: boolean, id: string): void {
    const widgetIndex = this.myItems().findIndex((w) => w.id === id);

    if (widgetIndex === 0) {
      this.dirtyIds.add(id);

      this.myItems.update((items) =>
        items.map((i) => (i.id === id ? { ...i, isHidden: !isSelected } : i)),
      );

      this.updateStream$.next(this.myItems());

      this.store.dispatch(
        UserInfoActions.loadWidgetsSuccess({ widgets: this.myItems() }),
      );
    }
  }

  public onToggleCatalogWidget(isSelected: boolean, id: string): void {
    const existingWidget = this.myItems().find((w) => w.id === id);
    const widgetIndex = this.myItems().findIndex((w) => w.id === id);

    if (widgetIndex === -1 && isSelected) {
      const catalogWidget = this.widgetCatalog().find((w) => w.id === id);
      if (catalogWidget) {
        const activeCount = this.visibleItems().length;
        const newOrder = activeCount + 1;
        this.store.dispatch(
          UserInfoActions.createWidget({
            widget: {
              ...catalogWidget,
              order: newOrder,
              hasFullWidth: newOrder === 1,
              isHidden: false,
            },
          }),
        );
      }
    } else if (!isSelected && widgetIndex > 0 && existingWidget?.dbId) {
      this.store.dispatch(
        UserInfoActions.deleteWidget({ id: existingWidget.dbId }),
      );
      this.myItems.update((items) => items.filter((i) => i.id !== id));
    } else if (widgetIndex === 0) {
      this.onFoldWidget(isSelected, id);
    }
  }

  public onWidgetRefresh(item: IWidgetItem): void {
    this.store.dispatch(clearExchangeRates());
    this.store.dispatch(loadExchangeRates({ baseCurrency: 'USD' }));
  }

  public onWidgetAdd(item: IWidgetItem): void {
    this.router.navigate(['/bank/products/accounts']);
  }

  public onPaginationChange(item: number): void {
    this.store.dispatch(
      TransactionActions.updateFilters({
        filters: { pageLimit: item },
      }),
    );

    this.store.dispatch(
      TransactionActions.loadTransactions({ forceRefresh: true }),
    );
  }

  public readonly gridColumns = { default: 2, md: 0, sm: 0 };

  ngOnInit(): void {
    const areWidgetsLoaded = this.store.selectSignal(selectWidgetsLoaded)();

    if (!areWidgetsLoaded) {
      this.store.dispatch(UserInfoActions.loadWidgets({}));
    }
    this.store.dispatch(TransactionActions.enter());
    this.store.dispatch(loadExchangeRates({ baseCurrency: 'USD' }));
    this.store.dispatch(AccountsActions.loadAccounts({}));
  }
}
