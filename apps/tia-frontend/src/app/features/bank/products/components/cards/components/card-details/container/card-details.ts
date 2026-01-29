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
import { tap } from 'rxjs/operators';
import { loadCardDetails } from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectCardDetails,
  selectCardImages,
  selectCardDetailsLoading,
  selectCardDetailsError,
} from '../../../../../../../../store/products/cards/cards.selectors';
import { CardDetail } from '@tia/shared/models/cards/card-detail.model';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.html',
  styleUrls: ['./card-details.scss'],
  imports: [CommonModule],
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
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  protected readonly cardData = computed(() => {
    const details = this.cardDetails()[this.cardId];
    const image = this.cardImages()[this.cardId];
    
    if (!details || !image) return null;
    
    return {
      cardId: this.cardId,
      details,
      imageBase64: image,
    };
  });

  private readonly cardDetailsSubscription = this.store.select(selectCardDetails)
    .pipe(
      tap(details => this.cardDetails.set(details)),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe();

  private readonly cardImagesSubscription = this.store.select(selectCardImages)
    .pipe(
      tap(images => this.cardImages.set(images)),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe();

  private readonly loadingSubscription = this.store.select(selectCardDetailsLoading)
    .pipe(
      tap(loading => this.loading.set(loading)),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe();

  private readonly errorSubscription = this.store.select(selectCardDetailsError)
    .pipe(
      tap(error => this.error.set(error)),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe();

  ngOnInit(): void {
    this.store.dispatch(loadCardDetails({ cardId: this.cardId }));
  }

  protected handleBack(): void {
    this.router.navigate(['/bank/products/cards']);
  }

  protected shouldShowCreditLimit(details: CardDetail): boolean {
    return details.type === 'CREDIT' && !!details.creditLimit;
  }

  protected isActiveStatus(status: string): boolean {
    return status === 'ACTIVE';
  }
}