// import {
//   ChangeDetectionStrategy,
//   Component,
//   inject,
//   input,
//   output,
//   signal,
//   effect,
//   DestroyRef,
// } from '@angular/core';
// import { DecimalPipe } from '@angular/common';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import {
//   FormBuilder,
//   FormControl,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { Store } from '@ngrx/store';
// import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
// import {
//   selectCardCreationData,
//   selectIsCreating,
//   selectCreateError,
//   selectShowSuccessAlert,
// } from '../../../../../../../../store/products/cards/cards.selectors';
// import {
//   loadCardCreationData,
//   createCard,
//   closeCreateCardModal,
// } from '../../../../../../../../store/products/cards/cards.actions';
// import { CreateCardRequest } from '@tia/shared/models/cards/create-card-request.model';
// import { CardForm } from '@tia/shared/models/cards/card-form.model';
// import { SimpleAlerts } from '@tia/shared/lib/alerts/components/simple-alerts/simple-alerts';

// @Component({
//   selector: 'app-create-card',
//   imports: [UiModal, ReactiveFormsModule, DecimalPipe, SimpleAlerts],
//   templateUrl: './createCard.html',
//   styleUrl: './createCard.scss',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class CreateCard {
//   private readonly store = inject(Store);
//   private readonly fb = inject(FormBuilder);
//   private readonly destroyRef = inject(DestroyRef);
// private readonly alertTimeoutId = signal<ReturnType<typeof setTimeout> | null>(null);

//   readonly isOpen = input.required<boolean>();
//   closed = output<void>();

//   protected readonly creationData = this.store.selectSignal(
//     selectCardCreationData,
//   );
//   protected readonly isCreating = this.store.selectSignal(selectIsCreating);
//   protected readonly createError = this.store.selectSignal(selectCreateError);

//   protected readonly selectedDesign = signal<string>('');

//   protected readonly cardForm: FormGroup<CardForm> = this.fb.group({
//     cardName: this.fb.nonNullable.control('', [
//       Validators.required,
//       Validators.minLength(2),
//     ]),
//     cardCategory: this.fb.nonNullable.control<'DEBIT' | 'CREDIT'>(
//       'DEBIT',
//       Validators.required,
//     ),
//     cardType: this.fb.nonNullable.control<'VISA' | 'MASTERCARD'>(
//       'VISA',
//       Validators.required,
//     ),
//     accountId: this.fb.nonNullable.control('', Validators.required),
//     design: this.fb.nonNullable.control('', Validators.required),
//   });
//   private readonly wasCreating = signal<boolean>(false);

//   constructor() {
//     effect(() => {
//       if (this.isOpen()) {
//         this.store.dispatch(loadCardCreationData());
//       }
//     });

//     effect(() => {
//       const creating = this.isCreating();
//       if (this.wasCreating() && !creating && !this.createError()) {
//         this.onClose();
//       }
//       this.wasCreating.set(creating);
//     });
//   }

//   protected selectDesign(design: string): void {
//     this.selectedDesign.set(design);
//     this.cardForm.patchValue({ design });
//   }

//   protected onSubmit(): void {
//     if (this.cardForm.valid) {
//       const request: CreateCardRequest = this.cardForm.getRawValue();
//       this.store.dispatch(createCard({ request }));
//     }
//   }

//   protected onClose(): void {
//     this.cardForm.reset();
//     this.selectedDesign.set('');
//     this.store.dispatch(closeCreateCardModal());
//     this.closed.emit();
//   }
//   protected readonly showSuccessAlert = this.store.selectSignal(
//     selectShowSuccessAlert,
//   );
// }


import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
  effect,
  DestroyRef,
  computed,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
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
import { SimpleAlerts } from '@tia/shared/lib/alerts/components/simple-alerts/simple-alerts';

@Component({
  selector: 'app-create-card',
  imports: [UiModal, ReactiveFormsModule, DecimalPipe],
  templateUrl: './createCard.html',
  styleUrl: './createCard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCard {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly isOpen = input.required<boolean>();
  closed = output<void>();

  protected readonly creationData = this.store.selectSignal(
    selectCardCreationData,
  );
  protected readonly isCreating = this.store.selectSignal(selectIsCreating);
  protected readonly createError = this.store.selectSignal(selectCreateError);


  protected readonly cardForm: FormGroup<CardForm> = this.fb.group({
    cardName: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    cardCategory: this.fb.nonNullable.control<'DEBIT' | 'CREDIT'>(
      'DEBIT',
      Validators.required,
    ),
    cardType: this.fb.nonNullable.control<'VISA' | 'MASTERCARD'>(
      'VISA',
      Validators.required,
    ),
    accountId: this.fb.nonNullable.control('', Validators.required),
    design: this.fb.nonNullable.control('', Validators.required),
  });

 constructor() {
  effect(() => {
    if (this.isOpen()) {
      this.store.dispatch(loadCardCreationData());
    }
  });

  effect(() => {
    const designs = this.creationData().designs;
    if (designs.length > 0 && !this.selectedDesign()) {
      this.selectDesign(designs[0].design);
    }
  });
}

  protected selectDesign(design: string): void {
    this.selectedDesign.set(design);
    this.cardForm.patchValue({ design });
  }

protected readonly selectedDesign = signal<string>('');

protected readonly selectedDesignUri = computed(() => {
  const selected = this.creationData().designs.find(
    (d) => d.design === this.selectedDesign(),
  );
  return selected?.uri || null;
});

  protected onSubmit(): void {
    if (this.cardForm.valid) {
      const request: CreateCardRequest = this.cardForm.getRawValue();
      this.store.dispatch(createCard({ request }));
    }
  }

  protected onClose(): void {
    this.cardForm.reset();
    this.selectedDesign.set('');
    this.store.dispatch(closeCreateCardModal());
    this.closed.emit();
  }
  protected getSelectedDesignUri(): string | null {
  const selected = this.creationData().designs.find(
    (d) => d.design === this.selectedDesign(),
  );
  return selected?.uri || null;
}
}