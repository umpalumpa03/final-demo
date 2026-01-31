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
import { DecimalPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import {
  selectCardCreationData,
  selectIsCreating,
  selectCreateError,
} from '../../../../../../../../store/products/cards/cards.selectors';
import {
  loadCardCreationData,
  createCard,
  closeCreateCardModal,
} from '../../../../../../../../store/products/cards/cards.actions';
import { CreateCardRequest } from '@tia/shared/models/cards/create-card-request.model';
import { CardForm } from '@tia/shared/models/cards/card-form.model';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';


@Component({
  selector: 'app-create-card',
  imports: [UiModal, ReactiveFormsModule, TextInput, Dropdowns,ButtonComponent],
  templateUrl: './createCard.html',
  styleUrl: './createCard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCard {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  readonly isOpen = input.required<boolean>();
  closed = output<void>();

  protected readonly creationData = this.store.selectSignal(selectCardCreationData);
  protected readonly isCreating = this.store.selectSignal(selectIsCreating);
  protected readonly createError = this.store.selectSignal(selectCreateError);

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
    this.selectDesign(designs[0].id);  
  }
});
  }

  protected selectDesign(design: string): void {
    this.selectedDesign.set(design);
    this.cardForm.patchValue({ design });
  }

  protected onSubmit(): void {
    if (this.cardForm.valid) {
      const request: CreateCardRequest = this.cardForm.getRawValue();
      this.store.dispatch(createCard({ request }));
    }
  }

protected onClose(): void {
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
  this.store.dispatch(closeCreateCardModal());
  this.closed.emit();
}
}