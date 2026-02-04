import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProviderList } from '../components/provider-list-items/provider-list';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import {
  PaybillFormProceedEvent,
  PaybillFormVerifyEvent,
} from '../../../shared/models/paybill.model';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-provider-list-container',
  imports: [ProviderList, RouterOutlet],
  templateUrl: './provider-list-container.html',
  styleUrl: './provider-list-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderListContainer {
  protected readonly facade = inject(PaybillMainFacade);

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
