
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
  effect,
  computed,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';

import { CreateCardRequest } from '@tia/shared/models/cards/create-card-request.model';
import { CardForm } from '@tia/shared/models/cards/card-form.model';
import { selectCardCreationData, selectCardCreationDataLoading } from 'apps/tia-frontend/src/app/store/products/cards/cards.selectors';
import { selectCreateError, selectIsCreating } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { closeCreateCardModal, createCard, loadCardCreationData } from 'apps/tia-frontend/src/app/store/products/cards/cards.actions';
import { CardPreview } from '../components/card-preview/card-preview';
import { DesignSelector } from '../components/design-selector/design-selector';
import { CreateCardForm } from '../components/create-card-form/create-card-form';


@Component({
  selector: 'app-create-card',
  templateUrl: './createCard.html',
  styleUrl: './createCard.scss',
  imports: [UiModal, CardPreview, DesignSelector, CreateCardForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCard {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  readonly isOpen = input.required<boolean>();
  readonly closed = output<void>();

  protected readonly creationData = this.store.selectSignal(selectCardCreationData);
  protected readonly isCreating = this.store.selectSignal(selectIsCreating);
  protected readonly createError = this.store.selectSignal(selectCreateError);
  protected readonly isLoadingData = this.store.selectSignal(selectCardCreationDataLoading);

  protected readonly cardForm: FormGroup<CardForm> = this.fb.group({
    cardName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    cardCategory: this.fb.nonNullable.control<'DEBIT' | 'CREDIT'>('DEBIT', Validators.required),
    cardType: this.fb.nonNullable.control<'VISA' | 'MASTERCARD'>('VISA', Validators.required),
    accountId: this.fb.nonNullable.control('', Validators.required),
    design: this.fb.nonNullable.control('', Validators.required),
  });

  protected readonly selectedDesign = signal<string>('');

  protected readonly selectedDesignUri = computed(() => {
    const selected = this.creationData().designs.find(
      (d) => d.id === this.selectedDesign(),
    );
    return selected?.uri || null;
  });

  protected readonly categoryOptions = computed(() =>
    this.creationData().categories.map((c) => ({ label: c.displayName, value: c.value }))
  );

  protected readonly typeOptions = computed(() =>
    this.creationData().types.map((t) => ({ label: t.displayName, value: t.value }))
  );

  protected readonly accountOptions = computed(() =>
    this.creationData().accounts.map((a) => ({
      label: `${a.name} - ${a.balance} ${a.currency}`,
      value: a.id,
    }))
  );

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.store.dispatch(loadCardCreationData());
      }
    });

    effect(() => {
      const designs = this.creationData().designs;
      if (designs.length > 0 && !this.selectedDesign()) {
        this.onDesignSelected(designs[0].id);
      }
    });
  }

  protected onDesignSelected(design: string): void {
    this.selectedDesign.set(design);
    this.cardForm.patchValue({ design });
  }

  protected onFormSubmit(): void {
    if (this.cardForm.valid) {
      const request: CreateCardRequest = this.cardForm.getRawValue();
      this.store.dispatch(createCard({ request }));
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
    this.selectedDesign.set('');
  }
}