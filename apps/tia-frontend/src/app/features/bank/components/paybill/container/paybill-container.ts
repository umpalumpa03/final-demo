import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Breadcrumbs } from '@tia/shared/lib/navigation/breadcrumbs/breadcrumbs';
import { LibraryTitle } from '../../../../storybook/shared/library-title/library-title';
import { Store } from '@ngrx/store';
import {
  selectActiveCategory,
  selectActiveProvider,
  selectCategories,
} from '../store/paybill.selectors';
import { PaybillActions } from '../store/paybill.actions';
import { PaybillCategory, PaybillProvider } from '../models/paybill.model';

@Component({
  selector: 'app-paybill-container',
  imports: [Breadcrumbs, LibraryTitle],
  templateUrl: './paybill-container.html',
  styleUrl: './paybill-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillContainer implements OnInit {
  public readonly paybillTitle = 'Pay Bills';
  public readonly paybillSubtitle = 'Pay your bills quickly and securely';

  private readonly store = inject(Store);

  public readonly breadcrumbs = computed(() => {
    const base = [{ label: 'Paybill', route: '/bank/paybill' }];
    const cat = this.activeCategory();
    const prov = this.activeProvider();

    if (cat) base.push({ label: cat.label, route: '' });
    if (prov) base.push({ label: prov.name, route: '' });

    return base;
  });

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

  public readonly categories = this.store.selectSignal(selectCategories);
  public readonly activeCategory =
    this.store.selectSignal(selectActiveCategory);
  public readonly activeProvider =
    this.store.selectSignal(selectActiveProvider);
}
