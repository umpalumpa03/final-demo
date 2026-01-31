import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as PAYBILL_SELECTORS from '../../../store/paybill.selectors';
import { CategoryGrid } from '../components/category-grid/category-grid';
import { CATEGORY_UI_MAP } from '../components/category-grid/config/category.config';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderList } from '../components/provider-list/provider-list';
import { PaybillForm } from '../components/paybill-form/paybill-form';
import { PaybillActions } from '../../../store/paybill.actions';
import { PaybillOtpVerification } from '../components/paybill-otp-verification/paybill-otp-verification';
import {
  PaybillPayload,
  ProceedPaymentPayload,
} from '../shared/models/paybill.model';
import { PaybillConfirmPayment } from '../components/paybill-confirm-payment/paybill-confirm-payment';
import { selectCurrentAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';

@Component({
  selector: 'app-paybill-main',
  imports: [
    CategoryGrid,
    ProviderList,
    PaybillForm,
    PaybillOtpVerification,
    PaybillConfirmPayment,
  ],
  templateUrl: './paybill-main.html',
  styleUrl: './paybill-main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillMain implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // States

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
    selectCurrentAccounts,
  );

  public ngOnInit(): void {
    this.store.dispatch(AccountsActions.loadAccounts());
  }

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

  public selectCategory(categoryId: string): void {
    this.router.navigate([categoryId.toLowerCase()], {
      relativeTo: this.route,
    });
  }

  public selectProvider(providerId: string): void {
    const category = this.activeCategory();

    if (category?.id && providerId) {
      this.store.dispatch(
        PaybillActions.selectProvider({
          providerId: providerId.toUpperCase(),
        }),
      );

      const catId = category.id.toLowerCase();
      const provId = providerId.toLowerCase();

      this.router.navigate([catId, provId], {
        relativeTo: this.route.parent,
      });
    }
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

    if (provider && data) {
      const payload: ProceedPaymentPayload = {
        serviceId: provider.id,
        identification: { accountNumber: data.accountNumber },
        amount: data.amount,
        senderAccountId: 'a1000001-0001-4000-8000-000000000004',
      };

      this.store.dispatch(PaybillActions.proceedPayment({ payload }));
    }
  }

  public onPaymentMethodSelected(): void {
    this.store.dispatch(PaybillActions.setPaymentStep({ step: 'SUCCESS' }));
  }

  public onBackToDetails(): void {
    this.store.dispatch(PaybillActions.setPaymentStep({ step: 'DETAILS' }));
  }

public onOtpVerified(otpCode: string): void {
  const challengeId = this.challengeId();
  
  // DEBUG: Check if the orchestrator receives the event and the ID
  console.log('OTP Received:', otpCode);
  console.log('Challenge ID from Store:', challengeId);

  if (challengeId) {
    this.store.dispatch(
      PaybillActions.confirmPayment({
        payload: { challengeId, code: otpCode },
      }),
    );
  } else {
    console.error('Confirm Payment failed: No challengeId found in store. Ensure the /pay request succeeded.');
  }
}

  public readonly activeCategoryUI = computed(() => {
    const category = this.activeCategory();
    if (!category) return null;
    return CATEGORY_UI_MAP[category.id.toLowerCase()] || null;
  });
}
