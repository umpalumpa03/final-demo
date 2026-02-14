import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { Breadcrumbs } from '@tia/shared/lib/navigation/breadcrumbs/breadcrumbs';
import { LibraryTitle } from '../../../storybook/shared/library-title/library-title';
import { Store } from '@ngrx/store';
import {
  selectActiveCategory,
  selectActiveProvider,
  selectCategories,
} from '../store/paybill.selectors';
import { PaybillActions } from '../store/paybill.actions';
import {
  PaybillCategory,
  PaybillProvider,
} from '../components/paybill-main/shared/models/paybill.model';
import { RouterModule } from '@angular/router';
import { navConfig } from '../config/paybill.config';
import { Tabs } from '@tia/shared/lib/navigation/tabs/tabs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import * as PAYBILL_SELECTORS from '../store/paybill.selectors';
import { BreadcrumbService } from '../services/breadcrumb/breadcrumb';
@Component({
  selector: 'app-paybill-container',
  imports: [
    Breadcrumbs,
    LibraryTitle,
    RouterModule,
    Tabs,
    TranslatePipe,
  ],
  templateUrl: './paybill-container.html',
  styleUrl: './paybill-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillContainer implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly store = inject(Store);
  private readonly breadcrumbService = inject(BreadcrumbService);

  public readonly categories = this.store.selectSignal(selectCategories);
  public readonly activeCategory =
    this.store.selectSignal(selectActiveCategory);
  public readonly activeProvider =
    this.store.selectSignal(selectActiveProvider);

  public readonly navigationConfig = navConfig(this.translate);

  public readonly breadcrumbs = computed(() => {
    return this.breadcrumbService.breadcrumbs$();
  });

  // alert system
  protected readonly notifications = this.store.selectSignal(
    PAYBILL_SELECTORS.selectNotifications,
  );

  public handleDismiss(id: string): void {
    this.store.dispatch(PaybillActions.dismissNotification({ id }));
  }

  public handleCategorySelect(category: PaybillCategory): void {
    this.store.dispatch(
      PaybillActions.selectCategory({ categoryId: category.id }),
    );
  }

  public handleProviderSelect(provider: PaybillProvider): void {
    this.store.dispatch(
      PaybillActions.selectProvider({ providerId: provider.id }),
    );
  }

  public navigateBack(): void {
    this.store.dispatch(PaybillActions.clearSelection());
  }

  public handleNativeClick(event: Event): void {
    const text = (event.target as HTMLElement).textContent?.trim();

    if (text === 'Paybill') {
      this.navigateBack();
    } else {
      const category = this.activeCategory();
      if (category && text === category.name && this.activeProvider()) {
        this.handleCategorySelect(category);
      }
    }
  }

  ngOnInit(): void {
    this.store.dispatch(PaybillActions.loadCategories());
  }
}
