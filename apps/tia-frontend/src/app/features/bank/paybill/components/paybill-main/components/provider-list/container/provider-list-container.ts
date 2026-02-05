import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ProviderList } from '../components/provider-list-items/provider-list';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import {
  PaybillFormProceedEvent,
  PaybillFormVerifyEvent,
  PaybillProvider,
} from '../../../shared/models/paybill.model';
import { RouterOutlet } from '@angular/router';
import {
  getCurrentHeader,
  getDisplayItems,
} from '../../../shared/utils/paybill.config';

@Component({
  selector: 'app-provider-list-container',
  imports: [ProviderList, RouterOutlet],
  templateUrl: './provider-list-container.html',
  styleUrl: './provider-list-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderListContainer {
  protected readonly facade = inject(PaybillMainFacade);

  // methods for handling navigation

  private readonly visibleProviderIds = computed(() => {
    const query = this.facade.searchQuery().toLowerCase().trim();
    const category = this.facade.activeCategory();

    if (!query || !category?.providers) return null;

    const providers = category.providers;
    const visibleIds = new Set<string>();

    const matches = providers.filter((p) =>
      p.name?.toLowerCase().includes(query),
    );

    matches.forEach((match) => {
      let current: PaybillProvider | undefined = match;
      while (current) {
        visibleIds.add(current.id);
        if (current.parentId) {
          current = providers.find((p) => p.id === current!.parentId);
        } else {
          current = undefined;
        }
      }
    });

    return visibleIds;
  });

  public readonly filteredProviders = computed(() => {
    const category = this.facade.activeCategory();
    if (!category || !category.providers) return [];

    const currentLevelItems = getDisplayItems(
      category.providers,
      this.facade.selectedParentId(),
    );
    const visibleSet = this.visibleProviderIds();

    if (visibleSet) {
      return currentLevelItems.filter((item) => visibleSet.has(item.id));
    }

    return currentLevelItems;
  });

  public readonly providerListHeader = computed(() => {
    const category = this.facade.activeCategory();
    if (!category || !category.providers) return '';
    return getCurrentHeader(
      category.providers,
      this.facade.selectedParentId(),
      category.name,
    );
  });

  // action handling

  public onProviderSelected(providerId: string): void {
    const category = this.facade.activeCategory();
    if (!category?.providers) return;

    const provider = category.providers.find((p) => p.id === providerId);
    if (!provider) return;

    if (provider.isFinal) {
      this.facade.resetPaymentForm();

      this.facade.selectProvider(providerId);
    } else {
      this.facade.selectParentId(provider.id);
    }
  }

  public onVerifyAccount(data: PaybillFormVerifyEvent): void {
    this.facade.verifyAccount(data.value);
  }

  public onProceedToPayment(data: PaybillFormProceedEvent): void {
    this.facade.proceedToPayment(data.amount, data.value);
  }
}
