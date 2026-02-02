

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { combineLatest, map, switchMap, of } from 'rxjs';
import { loadCardDetails, loadCardAccounts } from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectCardDetails,
  selectCardImages,
  selectCardDetailsLoading,
  selectCardDetailsError,
  selectAccountById,
} from '../../../../../../../../store/products/cards/cards.selectors';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { CardImage } from '../components/card-image/card-image';
import { CardInfoSection } from '../components/card-info-section/card-info-section';
import { QuickActionsSection } from '../components/quick-actions-section/quick-actions-section';
import { CardWithDetails } from '../../../models/card-image.model';

interface CardDataWithAccount extends CardWithDetails {
  account: CardAccount | undefined;
}

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.html',
  styleUrls: ['./card-details.scss'],
  imports: [
    CommonModule,
    RouteLoader,
    ButtonComponent,
    BasicCard,
    ErrorStates,
    CardImage,
    CardInfoSection,
    QuickActionsSection,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDetails implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly cardId = this.route.snapshot.paramMap.get('cardId') || '';

  protected readonly loading$ = this.store.select(selectCardDetailsLoading);
  protected readonly error$ = this.store.select(selectCardDetailsError);

  protected readonly cardData$ = combineLatest([
    this.store.select(selectCardDetails),
    this.store.select(selectCardImages),
  ]).pipe(
    switchMap(([details, images]) => {
      const detail = details[this.cardId];
      const image = images[this.cardId];

      if (!detail || !image) return of(null);

      if (detail.accountId) {
        return this.store.select(selectAccountById(detail.accountId)).pipe(
          map((account): CardDataWithAccount => ({
            cardId: this.cardId,
            details: detail,
            imageBase64: image,
            account,
          }))
        );
      }

      return of({
        cardId: this.cardId,
        details: detail,
        imageBase64: image,
        account: undefined,
      });
    })
  );

  protected readonly currency$ = this.cardData$.pipe(
    map(data => data?.account?.currency ?? 'N/A')
  );

  protected readonly formattedBalance$ = this.cardData$.pipe(
    map(data => {
      if (!data?.account) return 'N/A';
      return `${data.account.currency} ${data.account.balance.toLocaleString()}`;
    })
  );

  protected readonly formattedCreditLimit$ = this.cardData$.pipe(
    map(data => {
      if (!data?.account || !data.details.creditLimit) return 'N/A';
      return `${data.account.currency} ${data.details.creditLimit.toLocaleString()}`;
    })
  );

  protected readonly shouldShowCreditLimit$ = this.cardData$.pipe(
    map(data => data?.details.type === 'CREDIT' && !!data.details.creditLimit)
  );

  protected readonly isActiveStatus$ = this.cardData$.pipe(
    map(data => data?.details.status === 'ACTIVE')
  );

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

  protected handleRetry(): void {
    this.store.dispatch(loadCardAccounts());
    this.store.dispatch(loadCardDetails({ cardId: this.cardId }));
  }
}