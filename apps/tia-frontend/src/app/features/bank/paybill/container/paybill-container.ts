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
import { PaybillCategory, PaybillProvider } from '../models/paybill.model';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { navConfig } from '../config/paybill.config';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Tabs } from '@tia/shared/lib/navigation/tabs/tabs';

@Component({
  selector: 'app-paybill-container',
  imports: [Breadcrumbs, LibraryTitle, RouterModule, Tabs],
  templateUrl: './paybill-container.html',
  styleUrl: './paybill-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillContainer implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  public readonly paybillTitle = 'Pay Bills';
  public readonly paybillSubtitle = 'Pay your bills quickly and securely';

  public readonly navigationConfig = navConfig;

  public ngOnInit(): void {
    this.store.dispatch(PaybillActions.loadCategories());
  }

  private readonly urlSignal = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  public readonly breadcrumbs = computed(() => {
    const currentUrl = this.urlSignal();
    const base = [{ label: 'Paybill', route: '/bank/paybill' }];

    if (currentUrl.includes('templates')) {
      return [...base, { label: 'Templates', route: '' }];
    }

    const cat = this.activeCategory();
    const prov = this.activeProvider();

    if (cat) base.push({ label: cat.name, route: '' });
    if (prov) base.push({ label: prov.name, route: '' });

    return base;
  });

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

  public readonly categories = this.store.selectSignal(selectCategories);
  public readonly activeCategory =
    this.store.selectSignal(selectActiveCategory);
  public readonly activeProvider =
    this.store.selectSignal(selectActiveProvider);
}
