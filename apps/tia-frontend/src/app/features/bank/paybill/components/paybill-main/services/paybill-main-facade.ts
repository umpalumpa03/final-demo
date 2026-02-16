import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
  untracked,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as PAYBILL_SELECTORS from '../../../store/paybill.selectors';
import { selectGelAccountOptions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { CATEGORY_UI_MAP } from '../components/category-grid/config/category.config';
import { PaybillActions } from '../../../store/paybill.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import { PaybillProvider } from '../shared/models/paybill.model';
import { selectTransactionToRepeat } from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';

@Injectable({
  providedIn: 'root',
})
export class PaybillMainFacade {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  public readonly searchQuery = signal('');

  public init(): void {
    this.store.dispatch(PaybillActions.loadCategories());
    this.store.dispatch(PaybillActions.initRepeatProcess());
    this.searchQuery.set('');

    const url = this.router.url.split('?')[0];
    const segments = url.split('/').filter((s) => s);
    const payIndex = segments.indexOf('pay');

    if (payIndex !== -1 && segments.length > payIndex + 1) {
      const categoryId = segments[payIndex + 1];
      this.store.dispatch(PaybillActions.selectCategory({ categoryId }));

      if (segments.length > payIndex + 2) {
        const providerId = segments[segments.length - 1];
        this.store.dispatch(PaybillActions.selectProvider({ providerId }));
      }
    } else {
      if (!this.transactionToRepeat()) {
        this.store.dispatch(PaybillActions.clearSelection());
      }
    }
  }

  constructor() {
    effect(() => {
      const provider = this.activeProvider();

      if (provider?.isFinal) {
        const fields = untracked(() => this.paymentFields());

        if (!fields || fields.length === 0) {
          if (!this.router.url.includes('templates')) {
            untracked(() => {
              this.store.dispatch(
                PaybillActions.loadPaymentDetails({
                  serviceId: provider.id,
                }),
              );
            });
          }
        }
      }
    });
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

  public readonly selectedSenderAccountId = this.store.selectSignal(
    PAYBILL_SELECTORS.selectSelectedSenderAccountId,
  );

  public readonly transactionToRepeat = this.store.selectSignal(
    selectTransactionToRepeat,
  );

  // Computed data for smart components

  public readonly activeProvider = computed(() => {
    const urlId = this.selectedParentId();
    const category = this.activeCategory();
    const storeProvider = this.storeActiveProvider();

    if (
      storeProvider &&
      (!urlId || storeProvider.id.toLowerCase() === urlId.toLowerCase())
    ) {
      return storeProvider;
    }

    if (urlId && category?.providers) {
      const found = this.findProviderRecursive(category.providers, urlId);
      if (found) return found;
    }

    return storeProvider || null;
  });

  public readonly isCategoriesPage = computed(() => {
    const segments = this.urlSegments();
    return segments.length > 0 && segments[segments.length - 1] === 'pay';
  });

  public readonly isProviderListVisible = computed(() => {
    return !!this.activeCategory();
  });

  private findProviderRecursive(
    providers: PaybillProvider[],
    targetId: string,
  ): PaybillProvider | null {
    const lowerTarget = targetId.toLowerCase();

    for (const p of providers) {
      if (p.id?.toLowerCase() === lowerTarget) {
        return p;
      }

      if (p.children && p.children.length > 0) {
        const found = this.findProviderRecursive(p.children, targetId);
        if (found) return found;
      }
    }

    return null;
  }

  public readonly urlSegments = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => {
        const url = this.router.url.split('?')[0];
        return url.split('/').filter((p) => p);
      }),
    ),
    {
      initialValue: this.router.url
        .split('?')[0]
        .split('/')
        .filter((p) => p),
    },
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

  public clearRepeatTransaction(): void {
    this.store.dispatch(TransactionActions.clearTransactionToRepeat());
    this.store.dispatch(PaybillActions.clearSelection());
  }

  public updateSenderAccount(senderAccountId: string | null): void {
    if (!senderAccountId) return;
    const current = this.paymentPayload();
    if (current) {
      this.store.dispatch(
        PaybillActions.setPaymentPayload({
          data: { ...current, senderAccountId },
        }),
      );
    }
  }
}
