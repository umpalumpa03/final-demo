import { computed, inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as PAYBILL_SELECTORS from '../../../store/paybill.selectors';
import { selectGelAccountOptions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { CATEGORY_UI_MAP } from '../components/category-grid/config/category.config';
import { PaybillActions } from '../../../store/paybill.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { PaybillDynamicForm } from '../../../services/paybill-dynamic-form/paybill-dynamic-form';

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
    this.store.dispatch(PaybillActions.clearSelection());
    this.searchQuery.set('');
  }

  // select state from store

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

  public readonly urlSegments = toSignal(
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

  public readonly activeCategoryUI = computed(() => {
    const category = this.activeCategory();
    return category ? CATEGORY_UI_MAP[category.id.toLowerCase()] || null : null;
  });

  private readonly hideSearchRoutes = [
    'otp-verification',
    'confirm-payment',
    'payment-success',
    'templates',
  ];

  public readonly showSearch = computed(() => {
    const segments = this.urlSegments() || [];
    const currentPath = segments[segments.length - 1];

    if (this.hideSearchRoutes.includes(currentPath)) {
      return false;
    }
    return !this.isFormView();
  });

  public readonly isRootProviderView = computed(() => !this.selectedParentId());

  public setSearchQuery(query: string): void {
    this.searchQuery.set(query);
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
    this.router.navigate(['bank/paybill/pay']);
  }
}
