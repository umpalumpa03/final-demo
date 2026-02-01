import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as PAYBILL_SELECTORS from '../../../store/paybill.selectors';
import { CategoryGrid } from '../components/category-grid/category-grid';
import { CATEGORY_UI_MAP } from '../components/category-grid/config/category.config';
import { Router } from '@angular/router';
import { ProviderList } from '../components/provider-list/provider-list';
import { PaybillForm } from '../components/paybill-form/paybill-form';
import { PaybillActions } from '../../../store/paybill.actions';
import { PaybillOtpVerification } from '../components/paybill-otp-verification/paybill-otp-verification';
import { PaybillPayload } from '../shared/models/paybill.model';
import { PaybillConfirmPayment } from '../components/paybill-confirm-payment/paybill-confirm-payment';
import { selectGelAccountOptions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { PaybillSuccess } from '../components/paybill-success/paybill-success';
import { getSuccessSummaryItems } from '../shared/utils/paybill.utils';

@Component({
  selector: 'app-paybill-main',
  imports: [
    CategoryGrid,
    ProviderList,
    PaybillForm,
    PaybillOtpVerification,
    PaybillConfirmPayment,
    PaybillSuccess,
  ],
  templateUrl: './paybill-main.html',
  styleUrl: './paybill-main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillMain implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  public ngOnInit(): void {
    this.store.dispatch(AccountsActions.loadAccounts());
  }

  // States

  protected readonly selectedSenderAccountId = signal<string | null>(null);

  public readonly currentStep = this.store.selectSignal(
    PAYBILL_SELECTORS.selectCurrentStep,
  );
  public readonly paymentPayload = this.store.selectSignal(
    PAYBILL_SELECTORS.selectPaymentPayload,
  );

  public readonly activeCategory = this.store.selectSignal(
    PAYBILL_SELECTORS.selectActiveCategory,
  );
  public readonly activeProvider = this.store.selectSignal(
    PAYBILL_SELECTORS.selectActiveProvider,
  );
  public readonly categories = this.store.selectSignal(
    PAYBILL_SELECTORS.selectCategories,
  );

  public readonly verifiedDetails = this.store.selectSignal(
    PAYBILL_SELECTORS.selectVerifiedDetails,
  );
  public readonly isLoading = this.store.selectSignal(
    PAYBILL_SELECTORS.selectLoading,
  );

  public readonly challengeId = this.store.selectSignal(
    PAYBILL_SELECTORS.selectChallengeId,
  );

  // State from global store

  public readonly storeAccounts = this.store.selectSignal(
    selectGelAccountOptions,
  );

  public selectCategory(categoryId: string): void {
    this.store.dispatch(PaybillActions.selectCategory({ categoryId }));
  }

  public selectProvider(providerId: string): void {
    this.store.dispatch(PaybillActions.selectProvider({ providerId }));
  }

  private buildProceedPayload(provider: any, data: any, senderId: string) {
    return {
      serviceId: provider.id,
      identification: { accountNumber: data.accountNumber },
      amount: data.amount,
      senderAccountId: senderId,
    };
  }

  // Action methods (onSomething....)

  public onAccountSelected(accountId: string): void {
    this.selectedSenderAccountId.set(accountId);
  }

  public onBackToDetails(): void {
    this.store.dispatch(PaybillActions.clearAllNotifications());
    this.store.dispatch(PaybillActions.setPaymentStep({ step: 'DETAILS' }));
  }

  public onVerifyAccount(data: { accountNumber: string }): void {
    const provider = this.activeProvider();
    if (provider) {
      this.store.dispatch(
        PaybillActions.checkBill({
          serviceId: provider.id,
          accountNumber: data.accountNumber,
        }),
      );
    }
  }

  public onProceedToPayment(data: PaybillPayload): void {
    const provider = this.activeProvider();
    if (provider) {
      this.store.dispatch(PaybillActions.setPaymentPayload({ data }));

      this.store.dispatch(PaybillActions.setPaymentStep({ step: 'CONFIRM' }));
    }
  }

  public onFinalConfirm(): void {
    const provider = this.activeProvider();
    const data = this.paymentPayload();
    const senderId = this.selectedSenderAccountId();

    if (provider && data && senderId) {
      this.store.dispatch(
        PaybillActions.proceedPayment({
          payload: this.buildProceedPayload(provider, data, senderId),
        }),
      );
    }
  }

  public onOtpVerified(otpCode: string): void {
    const challengeId = this.challengeId();
    if (challengeId) {
      this.store.dispatch(
        PaybillActions.confirmPayment({
          payload: { challengeId, code: otpCode },
        }),
      );
    }
  }

  public onResetFlow(): void {
    this.store.dispatch(PaybillActions.clearSelection());
    this.router.navigate(['/bank/paybill/pay']);
  }

  public onGoDashboard(): void {
    this.router.navigate(['/bank/dashboard']);
  }

  // comptued data (signals dynamic)

  public readonly activeCategoryUI = computed(() => {
    const category = this.activeCategory();
    if (!category) return null;
    return CATEGORY_UI_MAP[category.id.toLowerCase()] || null;
  });

  protected readonly successSummaryItems = computed(() =>
    getSuccessSummaryItems(this.activeProvider(), this.paymentPayload()),
  );

  public readonly formattedCategories = computed(() => {
    return this.categories().map((cat) => {
      const lookupKey = cat.id.toLowerCase();

      const config = CATEGORY_UI_MAP[lookupKey] || {
        iconBgColor: '#F5F5F5',
      };

      return {
        ...cat,
        iconBgColor: config.iconBgColor,
        iconBgPath: config.iconBgPath,
        count: cat.providers?.length || 0,
      };
    });
  });
}
