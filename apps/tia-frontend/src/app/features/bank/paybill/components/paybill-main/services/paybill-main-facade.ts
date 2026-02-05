import { computed, inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as PAYBILL_SELECTORS from '../../../store/paybill.selectors';
import { selectGelAccountOptions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import {
  PaybillIdentification,
  PaybillProvider,
} from '../shared/models/paybill.model';
import {
  getCurrentHeader,
  getDisplayItems,
  getSuccessSummaryItems,
} from '../shared/utils/paybill.config';
import { CATEGORY_UI_MAP } from '../components/category-grid/config/category.config';
import { InputConfig } from '@tia/shared/lib/forms/models/input.model';
import {
  PaybillActions,
  TemplatesPageActions,
} from '../../../store/paybill.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { PaybillDynamicForm } from '../../../services/paybill-dynamic-form/paybill-dynamic-form';
import { PaybillDynamicFormValues } from '../../../services/paybill-dynamic-form/models/dynamic-form.model';
import { buildDynamicIdentification } from '../../../config/paybill.config';

@Injectable({
  providedIn: 'root',
})
export class PaybillMainFacade {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly dynamicFormService = inject(PaybillDynamicForm);
  public readonly searchQuery = signal('');
  public readonly selectedSenderAccountId = signal<string | null>(null);

  public init(): void {
    this.store.dispatch(AccountsActions.loadAccounts({}));
    this.searchQuery.set('');
  }

  // select state from store

  public readonly currentStep = this.store.selectSignal(
    PAYBILL_SELECTORS.selectCurrentStep,
  );
  public readonly paymentPayload = this.store.selectSignal(
    PAYBILL_SELECTORS.selectPaymentPayload,
  );
  public readonly activeCategory = this.store.selectSignal(
    PAYBILL_SELECTORS.selectActiveCategory,
  );
  private readonly storeActiveProvider = this.store.selectSignal(
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
  public readonly storeAccounts = this.store.selectSignal(
    selectGelAccountOptions,
  );

  public readonly paymentFields = this.store.selectSignal(
    PAYBILL_SELECTORS.selectPaymentFields,
  );

  // Computed data for smart components

  public readonly activeProvider = computed(() => {
    const urlId = this.selectedParentId();
    const category = this.activeCategory();

    if (urlId && category?.providers) {
      const providerFromUrl = category.providers.find((p) => p.id === urlId);

      if (providerFromUrl) return providerFromUrl;
    }

    return this.storeActiveProvider();
  });

  private readonly urlSegments = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => {
        const url = this.router.url.split('?')[0];
        return url.split('/').filter((p) => p);
      }),
    ),
  );

  public readonly selectedParentId = computed(() => {
    const segments = this.urlSegments();
    if (!segments || segments.length === 0) return null;

    const category = this.activeCategory();
    const lastSegment = segments[segments.length - 1];

    if (lastSegment === category?.id || lastSegment === 'pay') {
      return null;
    }
    return lastSegment;
  });

  public readonly isFormView = computed(() => {
    const currentId = this.selectedParentId();
    const category = this.activeCategory();

    const provider = category?.providers?.find((p) => p.id === currentId);

    return !!provider?.isFinal;
  });

  private readonly visibleProviderIds = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.activeCategory();

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
    const category = this.activeCategory();
    if (!category || !category.providers) return [];

    const currentLevelItems = getDisplayItems(
      category.providers,
      this.selectedParentId(),
    );
    const visibleSet = this.visibleProviderIds();

    if (visibleSet) {
      return currentLevelItems.filter((item) => visibleSet.has(item.id));
    }

    return currentLevelItems;
  });

  public readonly formattedCategories = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    let cats = this.categories().map((cat) => {
      const lookupKey = cat.id.toLowerCase();
      const config = CATEGORY_UI_MAP[lookupKey] || { iconBgColor: '#F5F5F5' };
      return {
        ...cat,
        iconBgColor: config.iconBgColor,
        iconBgPath: config.iconBgPath,
        count: cat.providers?.length || 0,
      };
    });

    if (query) {
      cats = cats.filter((c) => c.name.toLowerCase().includes(query));
    }
    return cats;
  });

  public readonly activeCategoryUI = computed(() => {
    const category = this.activeCategory();
    return category ? CATEGORY_UI_MAP[category.id.toLowerCase()] || null : null;
  });

  public readonly providerListHeader = computed(() => {
    const category = this.activeCategory();
    if (!category || !category.providers) return '';
    return getCurrentHeader(
      category.providers,
      this.selectedParentId(),
      category.name,
    );
  });

  public readonly searchInputConfig = computed<InputConfig>(() => ({
    placeholder: `Search active providers...`,
    prefixIcon: 'images/svg/search.svg',
    clearable: true,
    ariaLabel: 'Search providers',
  }));

  public readonly showSearch = computed(() => !this.isFormView());
  public readonly isRootProviderView = computed(() => !this.selectedParentId());

  public readonly successSummaryItems = computed(() => {
    try {
      const provider = this.activeProvider();
      const payload = this.paymentPayload();

      if (!provider || !payload) {
        return [];
      }

      const items = getSuccessSummaryItems(provider, payload);

      return items || [];
    } catch (e) {
      return [];
    }
  });

  public setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  public selectCategory(categoryId: string): void {
    this.store.dispatch(PaybillActions.selectCategory({ categoryId }));
  }

  public selectProvider(providerId: string): void {
    this.store.dispatch(PaybillActions.selectProvider({ providerId }));
    this.store.dispatch(
      PaybillActions.loadPaymentDetails({ serviceId: providerId }),
    );
  }

  public selectParentId(childId: string): void {
    const currentUrl = this.router.url.split('?')[0];
    const base = currentUrl.endsWith('/')
      ? currentUrl.slice(0, -1)
      : currentUrl;
    this.router.navigateByUrl(`${base}/${childId}`);
  }

  public verifyAccount(formValues: PaybillDynamicFormValues): void {
    const provider = this.activeProvider();

    const identification =
      this.dynamicFormService.buildIdentification(formValues);

    if (provider) {
      this.store.dispatch(
        PaybillActions.checkBill({
          serviceId: provider.id,
          identification,
        }),
      );

      this.store.dispatch(
        PaybillActions.setPaymentPayload({
          data: {
            identification,
            amount: formValues.amount || 0,
          },
        }),
      );
    }
  }

  public proceedToPayment(
    amount: number,
    formValues: PaybillDynamicFormValues,
  ): void {
    const provider = this.activeProvider();

    if (provider) {
      this.store.dispatch(PaybillActions.setTransactionProvider({ provider }));

      this.store.dispatch(
        PaybillActions.setPaymentPayload({
          data: {
            identification: buildDynamicIdentification(formValues),
            amount: amount,
          },
        }),
      );

      this.store.dispatch(PaybillActions.setPaymentStep({ step: 'CONFIRM' }));
      this.router.navigate(['/bank/paybill/pay/confirm-payment']);
    }
  }
  public confirmPayment(): void {
    const provider = this.activeProvider();
    const data = this.paymentPayload();
    const senderId = this.selectedSenderAccountId();

    if (provider && data && senderId) {
      this.store.dispatch(
        PaybillActions.proceedPayment({
          payload: {
            serviceId: provider.id,
            identification: data.identification,
            amount: data.amount,
            senderAccountId: senderId,
          },
        }),
      );
    }
  }

  public verifyOtp(otpCode: string): void {
    const challengeId = this.challengeId();
    if (challengeId) {
      this.store.dispatch(
        PaybillActions.confirmPayment({
          payload: { challengeId, code: otpCode },
        }),
      );
    }
  }

  public resetFlow(): void {
    this.store.dispatch(PaybillActions.clearSelection());
    this.router.navigate(['/bank/paybill/pay']);
  }

  public resetPaymentForm(): void {
    this.store.dispatch(PaybillActions.resetPaymentForm());
  }

  public resetToDashboard(): void {
    this.router.navigate(['/bank/dashboard']);
  }

  public backToDetails(): void {
    this.store.dispatch(PaybillActions.clearAllNotifications());
    this.store.dispatch(PaybillActions.setPaymentStep({ step: 'DETAILS' }));
    this.router.navigate(['bank/paybill/pay']);
  }

  public saveAsTemplate(customNickname?: string): void {
    const provider = this.activeProvider();
    const payload = this.paymentPayload();

    if (provider && payload) {
      this.store.dispatch(
        TemplatesPageActions.createTemplate({
          serviceId: provider.id,
          identification: payload.identification,
          nickname: customNickname || provider.name || 'My Template',
        }),
      );
    } else {
      return;
    }
  }
}
