

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
import {
  loadCardDetails,
  loadCardAccounts,
  openCardDetailsModal,
  closeCardDetailsModal,
} from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectCardDetails,
  selectCardImages,
  selectCardDetailsLoading,
  selectCardDetailsError,
  selectAccountById,
  selectIsCardDetailsModalOpen,
} from '../../../../../../../../store/products/cards/cards.selectors';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { CardImage } from '../components/card-image/card-image';
import { CardInfoSection } from '../components/card-info-section/card-info-section';
import { QuickActionsSection } from '../components/quick-actions-section/quick-actions-section';
import { CardViewData } from '../../../models/card-view-data.model';
import { TranslatePipe } from '@ngx-translate/core';
import { CardDetailsModal } from '../../card-details-modal/container/card-details-modal/card-details-modal';



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
    QuickActionsSection,TranslatePipe,CardDetailsModal
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
  protected readonly isDetailsModalOpen$ = this.store.select(selectIsCardDetailsModalOpen);


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
          map(
            (
              account,
            ): CardViewData => ({
              cardId: this.cardId,
              details: detail,
              imageBase64: image,
              account,
              currency: account?.currency ?? 'N/A',
              formattedBalance: account
                ? `${account.currency} ${account.balance.toLocaleString()}`
                : 'N/A',
              shouldShowCreditLimit:
                detail.type === 'CREDIT' && !!detail.creditLimit,
              formattedCreditLimit:
                account && detail.creditLimit
                  ? `${account.currency} ${detail.creditLimit.toLocaleString()}`
                  : 'N/A',
              isActiveStatus: detail.status === 'ACTIVE',
            }),
          ),
        );
      }

      return of(null);
    }),
  );

  ngOnInit(): void {
    this.loadCardData();
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
    this.loadCardData();
  }
  protected handleOpenDetailsModal(): void {
  this.store.dispatch(openCardDetailsModal({ cardId: this.cardId }));
}

protected handleCloseDetailsModal(): void {
  this.store.dispatch(closeCardDetailsModal());
}
  private loadCardData(): void {
    this.store.dispatch(loadCardAccounts());
    this.store.dispatch(loadCardDetails({ cardId: this.cardId }));
  }
}
