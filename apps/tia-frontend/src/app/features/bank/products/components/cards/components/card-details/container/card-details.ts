import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  DestroyRef,
  computed,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, switchMap, filter, map, take } from 'rxjs/operators';
import { loadCardDetails, loadCardAccounts } from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectCardDetails,
  selectCardImages,
  selectCardDetailsLoading,
  selectCardDetailsError,
  selectAccountById,
} from '../../../../../../../../store/products/cards/cards.selectors';
import { CardDetail } from '@tia/shared/models/cards/card-detail.model';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { of } from 'rxjs';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.html',
  styleUrls: ['./card-details.scss'],
  imports: [CommonModule, RouteLoader],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDetails implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly cardId = this.route.snapshot.paramMap.get('cardId') || '';
  private readonly cardDetails = signal<Record<string, CardDetail>>({});
  private readonly cardImages = signal<Record<string, string>>({});
  private readonly account = signal<CardAccount | undefined>(undefined);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  protected readonly cardData = computed(() => {
    const details = this.cardDetails()[this.cardId];
    const image = this.cardImages()[this.cardId];

    if (!details || !image) return null;

    const account = this.account();

    return {
      cardId: this.cardId,
      details,
      imageBase64: image,
      account,
    };
  });

  protected readonly currency = computed(() => {
    const account = this.account();
    return account?.currency ?? 'N/A';
  });

  protected readonly formattedBalance = computed(() => {
    const account = this.account();
    if (!account) return 'N/A';
    return `${account.currency} ${account.balance.toLocaleString()}`;
  });

  protected readonly formattedCreditLimit = computed(() => {
    const data = this.cardData();
    if (!data?.account || !data.details.creditLimit) return 'N/A';
    return `${data.account.currency} ${data.details.creditLimit.toLocaleString()}`;
  });

  protected readonly shouldShowCreditLimit = computed(() => {
    const data = this.cardData();
    return data?.details.type === 'CREDIT' && !!data.details.creditLimit;
  });

  protected readonly isActiveStatus = computed(() => {
    const data = this.cardData();
    return data?.details.status === 'ACTIVE';
  });

  private readonly cardDetailsSubscription = this.store
    .select(selectCardDetails)
    .pipe(
      tap((details) => this.cardDetails.set(details)),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe();

  private readonly cardImagesSubscription = this.store
    .select(selectCardImages)
    .pipe(
      tap((images) => this.cardImages.set(images)),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe();

  private readonly loadingSubscription = this.store
    .select(selectCardDetailsLoading)
    .pipe(
      tap((loading) => this.loading.set(loading)),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe();

  private readonly errorSubscription = this.store
    .select(selectCardDetailsError)
    .pipe(
      tap((error) => this.error.set(error)),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe();

private readonly accountSubscription = this.store
  .select(selectCardDetails)
  .pipe(
    map((details) => details[this.cardId]), 
    filter((detail) => !!detail),
    take(1), 
    switchMap((detail) => {
      if (detail?.accountId) {
        return this.store.select(selectAccountById(detail.accountId));
      }
      return of(undefined);
    }),
    tap((account) => this.account.set(account)),
    takeUntilDestroyed(this.destroyRef),
  )
  .subscribe();

  ngOnInit(): void {
    this.store.dispatch(loadCardAccounts());
    this.store.dispatch(loadCardDetails({ cardId: this.cardId }));
  }

  protected handleBack(): void {
    this.router.navigate(['/bank/products/cards']);
  }

  protected handleTransferOwn(): void {
    this.router.navigate(['/bank/transfers/internal']);
  }

  protected handleTransferExternal(): void {
    this.router.navigate(['/bank/transfers/external']);
  }

  protected handlePaybill(): void {
    this.router.navigate(['/bank/paybill']);
  }

  protected handleViewTransactions(): void {
    this.router.navigate(['/bank/products/cards/transactions', this.cardId]);
  }
}