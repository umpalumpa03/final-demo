

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, filter, map, pairwise, take, tap } from 'rxjs';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { CreateCardRequest } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/create-card-request.model';
import { CardForm } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-form.model';
import {
  selectCardCreationData,
  selectCardCreationDataLoading,
  selectCreateError,
  selectIsCreating,
} from 'apps/tia-frontend/src/app/store/products/cards/cards.selectors';
import {
  closeCreateCardModal,
  createCard,

} from 'apps/tia-frontend/src/app/store/products/cards/cards.actions';
import { CardPreview } from '../components/card-preview/card-preview';
import { DesignSelector } from '../components/design-selector/design-selector';
import { CreateCardForm } from '../components/create-card-form/create-card-form';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-card',
  templateUrl: './createCard.html',
  styleUrl: './createCard.scss',
  imports: [CommonModule, UiModal, CardPreview, DesignSelector, CreateCardForm,TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCard {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
private readonly translate = inject(TranslateService);
  readonly isOpen = input.required<boolean>();
  readonly closed = output<void>();

  protected readonly cardForm: FormGroup<CardForm> = this.fb.group({
    cardName: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    cardCategory: this.fb.nonNullable.control<'DEBIT' | 'CREDIT'>('DEBIT', Validators.required),
    cardType: this.fb.nonNullable.control<'VISA' | 'MASTERCARD'>('VISA', Validators.required),
    accountId: this.fb.nonNullable.control('', Validators.required),
    design: this.fb.nonNullable.control('', Validators.required),
  });

  private readonly selectedDesignId$ = new BehaviorSubject<string>('');
  
  protected get selectedDesignId(): string {
    return this.selectedDesignId$.value;
  }



  protected readonly viewData$ = combineLatest([
    this.store.select(selectCardCreationData),
    this.store.select(selectIsCreating),
    this.store.select(selectCreateError),
    this.store.select(selectCardCreationDataLoading),
    this.selectedDesignId$,
  ]).pipe(
    tap(([creationData, , , , selectedId]) => {
      if (creationData.designs.length > 0 && !selectedId) {
        this.selectedDesignId$.next(creationData.designs[0].id);
        this.cardForm.patchValue({ design: creationData.designs[0].id });
      }
    }),
    map(([creationData, isCreating, createError, isLoading, selectedId]) => {
      const selectedDesign = creationData.designs.find((d) => d.id === selectedId);
      
      return {
        designs: creationData.designs,
        selectedDesignUri: selectedDesign?.uri || null,
        categoryOptions: creationData.categories.map((c) => ({
          label: c.displayName,
          value: c.value,
        })),
        typeOptions: creationData.types.map((t) => ({
          label: t.displayName,
          value: t.value,
        })),
        accountOptions: creationData.accounts.map((a) => ({
          label: `${a.name} - ${a.balance} ${a.currency}`,
          value: a.id,
        })),
        isCreating,
        createError,
        isLoading,
      };
    })
  );

  protected onDesignSelected(design: string): void {
    this.selectedDesignId$.next(design);
    this.cardForm.patchValue({ design });
  }


  protected onFormSubmit(): void {
  if (this.cardForm.valid) {
    const request: CreateCardRequest = this.cardForm.getRawValue();
    this.store.dispatch(createCard({ request }));
    
    this.store.select(selectIsCreating).pipe(
      pairwise(),
      filter(([prev, curr]) => prev === true && curr === false),
      take(1),
      tap(() => {
        this.resetForm();
        this.store.dispatch(closeCreateCardModal());
        this.closed.emit();
      })
    ).subscribe();
  }
}
  protected onFormCancel(): void {
    this.resetForm();
    this.store.dispatch(closeCreateCardModal());
    this.closed.emit();
  }

  protected onClose(): void {
    this.resetForm();
    this.store.dispatch(closeCreateCardModal());
    this.closed.emit();
  }

  private resetForm(): void {
    this.cardForm.patchValue({
      cardName: '',
      cardCategory: 'DEBIT',
      cardType: 'VISA',
      accountId: '',
      design: '',
    });
    this.cardForm.markAsUntouched();
    this.cardForm.markAsPristine();
    this.selectedDesignId$.next('');
  }
 protected readonly formConfigs = computed(() => ({
  cardName: {
    placeholder: this.translate.instant('my-products.card.create-card-modal.create-card-form.enterText')
  },
  accountId: {
    placeholder: this.translate.instant('my-products.card.create-card-modal.create-card-form.chooseOption')
  }
}));
}