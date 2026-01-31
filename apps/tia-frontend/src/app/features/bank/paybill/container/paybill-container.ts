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
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-paybill-container',
  imports: [Breadcrumbs, LibraryTitle, RouterModule, Tabs, TranslatePipe],
  templateUrl: './paybill-container.html',
  styleUrl: './paybill-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillContainer implements OnInit {
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

  public readonly navigationConfig = navConfig;

  constructor() {
    const paramsSignal = toSignal(
      this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),

        map(() => {
          let child = this.route.firstChild;
          while (child?.firstChild) child = child.firstChild;
          return child?.snapshot.params;
        }),

        startWith(this.route.snapshot.firstChild?.params),
      ),
    );

    effect(() => {
      const params = paramsSignal();
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

      const isBasePaybill = this.router.url === '/bank/paybill';
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
