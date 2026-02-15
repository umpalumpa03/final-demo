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
import { BirthdayModalComponent } from '../../../birthday/components/birthday-modal';
import { BirthdayLogicService } from '../../../birthday/services/birthday-logic.service';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
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
import { Onboarding } from '../components/onboarding/onboarding';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { Tooltip } from '@tia/shared/lib/data-display/tooltip/tooltip';
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
    Onboarding,
    ErrorStates,
    Tooltip,
    BirthdayModalComponent,
    UiModal,
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
  protected readonly processedVisibleItems = this.dashService.processedItems;
  protected readonly gridColumns = this.dashService.gridColumns;
  protected readonly dynamicColspans = this.dashService.dynamicColspans;
  protected readonly widgetCatalog = this.dashService.widgetCatalog;
  protected readonly visibleItems = this.dashService.visibleItems;
  protected readonly isLoading = this.store.selectSignal(selectWidgetsLoading);

  protected readonly isCustomizing = signal(false);
  protected readonly bannerConfig = signal(bannerSlides);

  protected readonly draftSelection = signal<string[]>([]);

  protected readonly isHeroMode = computed(
    () =>
      this.visibleItems().length >= 3 && !this.breakpointService.isXsMobile(),
  );

  protected readonly accountsHidden = computed(() => {
    const accountsWidget = this.myItems().find((w) => w.type === 'accounts');
    return accountsWidget?.isHidden || false;
  });

  protected readonly pageTitle = computed(() =>
    this.translate.instant('dashboard.page.title'),
  );
  protected readonly pageSubtitle = computed(() =>
    this.translate.instant('dashboard.page.subtitle'),
  );

  public openCustomization = () => {
    this.draftSelection.set(this.myItems().map((w) => w.id));
    this.isCustomizing.set(true);
  };
  public closeCustomization = () => {
    this.isCustomizing.set(false);

    this.dashService.syncWidgetsFromDraft(this.draftSelection());
  };

  public onItemsChange(items: IWidgetItem[]): void {
    this.dashService.updateItemsOnDrag(items);
  }

  public onFoldWidget(isSelected: boolean, id: string): void {

    this.dashService.foldWidget(isSelected, id);
  }

  public onToggleCatalogWidget(isSelected: boolean, id: string): void {
    this.draftSelection.update((currentIds) => {
      if (isSelected) {
        return [...currentIds, id];
      } else {
        return currentIds.filter((itemId) => itemId !== id);
      }
    });
  }

  protected isWidgetActive(id: string): boolean {
    if (this.isCustomizing()) {
      return this.draftSelection().includes(id);
    }
    return this.myItems().some((w) => w.id === id);
  }

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

  private readonly birthdayLogic = inject(BirthdayLogicService);
  protected readonly isBirthdayVisible = this.birthdayLogic.isModalVisible;
  public onBirthdayDismiss = () => this.birthdayLogic.dismiss();

  ngOnInit(): void {
    if (!this.store.selectSignal(selectWidgetsLoaded)()) {
      this.store.dispatch(UserInfoActions.loadWidgets({}));
    }
    this.store.dispatch(TransactionActions.enter());
    this.store.dispatch(loadExchangeRates({ baseCurrency: 'USD' }));
    this.store.dispatch(AccountsActions.loadAccounts({}));
  }
}
