import {
  ChangeDetectionStrategy,
  Component,
  effect,
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
  selectPaybillBreadcrumbs,
} from '../store/paybill.selectors';
import { PaybillActions } from '../store/paybill.actions';
import {
  PaybillCategory,
  PaybillProvider,
} from '../components/paybill-main/shared/models/paybill.model';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { navConfig } from '../config/paybill.config';
import { Tabs } from '@tia/shared/lib/navigation/tabs/tabs';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import * as PAYBILL_SELECTORS from '../store/paybill.selectors';
import { DismissibleAlerts } from '@tia/shared/lib/alerts/components/dismissible-alerts/dismissible-alerts';
@Component({
  selector: 'app-paybill-container',
  imports: [
    Breadcrumbs,
    LibraryTitle,
    RouterModule,
    Tabs,
    TranslatePipe,
    DismissibleAlerts,
  ],
  templateUrl: './paybill-container.html',
  styleUrl: './paybill-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillContainer implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly breadcrumbs = this.store.selectSignal(
    selectPaybillBreadcrumbs,
  );
  public readonly categories = this.store.selectSignal(selectCategories);
  public readonly activeCategory =
    this.store.selectSignal(selectActiveCategory);
  public readonly activeProvider =
    this.store.selectSignal(selectActiveProvider);

  public readonly navigationConfig = navConfig(this.translate);

  protected readonly notifications = this.store.selectSignal(
    PAYBILL_SELECTORS.selectNotifications,
  );

  public handleDismiss(id: string): void {
    this.store.dispatch(PaybillActions.dismissNotification({ id }));
  }

  constructor() {
    const routeStateSignal = toSignal(
      this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => {
          let child = this.route.firstChild;
          while (child?.firstChild) child = child.firstChild;

          return {
            params: child?.snapshot.params,
            url: this.router.url,
          };
        }),
        startWith({
          params: this.route.snapshot.firstChild?.params,
          url: this.router.url,
        }),
      ),
    );

    effect(() => {
      const state = routeStateSignal();
      const params = state?.params;
      const url = state?.url ?? '';

      if (url.includes('/templates')) {
        this.store.dispatch(
          PaybillActions.selectCategory({ categoryId: 'TEMPLATES' }),
        );
        return;
      }

      const catId = params?.['categoryId']?.toUpperCase();
      const provId = params?.['providerId']?.toUpperCase();

      if (catId) {
        this.store.dispatch(
          PaybillActions.selectCategory({ categoryId: catId }),
        );
      }
      if (provId) {
        this.store.dispatch(
          PaybillActions.selectProvider({ providerId: provId }),
        );
      }

      const isBasePaybill =
        url.endsWith('/paybill/pay') || url.endsWith('/paybill/pay/');

      if (isBasePaybill) {
        this.store.dispatch(PaybillActions.clearSelection());
      }
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(PaybillActions.loadCategories());
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
}
