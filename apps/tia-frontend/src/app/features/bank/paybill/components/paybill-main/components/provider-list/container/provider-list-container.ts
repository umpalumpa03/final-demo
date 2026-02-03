import { Component, inject } from '@angular/core';
import { ProviderList } from '../components/provider-list-items/provider-list';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';

@Component({
  selector: 'app-provider-list-container',
  imports: [ProviderList],
  templateUrl: './provider-list-container.html',
  styleUrl: './provider-list-container.scss',
})
export class ProviderListContainer {
  protected readonly facade = inject(PaybillMainFacade);

  public onProviderListBack(): void {
    this.facade.navigateBack();
  }

  public onProviderSelected(providerId: string): void {
    const category = this.facade.activeCategory();
    if (!category?.providers) return;

    const provider = category.providers.find((p) => p.id === providerId);
    if (!provider) return;

    if (provider.isFinal) {
      this.facade.selectProvider(providerId);
    } else {
      this.facade.selectParentId(provider.id);
    }
  }
}
