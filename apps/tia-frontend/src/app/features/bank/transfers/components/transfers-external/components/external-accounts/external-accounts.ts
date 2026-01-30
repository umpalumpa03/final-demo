import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-external-accounts',
  imports: [],
  templateUrl: './external-accounts.html',
  styleUrl: './external-accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalAccounts {}


// import {
//   ChangeDetectionStrategy,
//   Component,
//   OnInit,
//   inject,
//   signal,
//   DestroyRef,
// } from '@angular/core';
// import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
// import { TranslatePipe, TranslateService } from '@ngx-translate/core';
// import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
// import { getRecipientInputConfig } from '../../config/transfers-external.config';
// import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
// import {
//   FormBuilder,
//   ReactiveFormsModule,
//   ValidationErrors,
// } from '@angular/forms';
// import { InputConfig } from '@tia/shared/lib/forms/models/input.model';
// import { recipientValidator } from '../../../../validators/transfer-validator';
// import { TransferValidationService } from '../../../../services/transfer-validation.service';
// import {
//   getErrorMessage,
//   getSuccessMessage,
// } from '../../../../utils/transfers-external.utils';
// import { RecipientType } from '../../../../models/transfers.state.model';
// import { TransfersAccountCard } from 'apps/tia-frontend/src/app/features/bank/transfers/ui/account-card/transfers-account-card';
// import { Account } from '@tia/shared/models/accounts/accounts.model';
// import { Store } from '@ngrx/store';
// import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
// import {
//   selectAccounts,
//   selectError,
//   selectIsLoading,
// } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
// import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
// import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
// import { map } from 'rxjs';

// @Component({
//   selector: 'app-external-recipient',
//   imports: [
//     TranslatePipe,
//     TextInput,
//     ButtonComponent,
//     ReactiveFormsModule,
//     TransfersAccountCard,
//     Spinner,
//     ErrorStates,
//   ],
//   templateUrl: './external-recipient.html',
//   styleUrl: './external-recipient.scss',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class ExternalRecipient implements OnInit {
//   private readonly translate = inject(TranslateService);
//   private readonly fb = inject(FormBuilder);
//   private readonly validationService = inject(TransferValidationService);
//   private readonly destroyRef = inject(DestroyRef);
//   private readonly store = inject(Store);
//   public readonly skeletonArray = Array(6).fill(0);

//   public selectedAccountId: string | null = null;

//   public readonly recipientInputConfig = signal<InputConfig>(
//     getRecipientInputConfig(this.translate),
//   );

//   public readonly recipientInput = this.fb.control('', [
//     recipientValidator(this.validationService),
//   ]);

//   public ngOnInit(): void {
//     this.store.dispatch(AccountsActions.loadAccounts());
//     this.setupValueChangeListener();
//   }

//   private setupValueChangeListener(): void {
//     this.recipientInput.valueChanges
//       .pipe(takeUntilDestroyed(this.destroyRef))
//       .subscribe((value) => {
//         this.updateInputConfig(value);
//       });
//   }

//   private updateInputConfig(value: string | null): void {
//     if (!value) {
//       this.clearMessages();
//       return;
//     }

//     const type = this.validationService.identifyRecipientType(value);
//     const isValid = this.recipientInput.valid;
//     const errors = this.recipientInput.errors;

//     if (isValid && type) {
//       this.setSuccessMessage(type);
//     } else if (errors) {
//       this.setErrorMessage(errors);
//     }
//   }

//   private clearMessages(): void {
//     this.recipientInputConfig.update((config) => ({
//       ...config,
//       errorMessage: undefined,
//       successMessage: undefined,
//     }));
//   }

//   private setSuccessMessage(type: RecipientType): void {
//     this.recipientInputConfig.update((config) => ({
//       ...config,
//       successMessage: getSuccessMessage(type, this.translate),
//       errorMessage: undefined,
//     }));
//   }

//   private setErrorMessage(errors: ValidationErrors): void {
//     this.recipientInputConfig.update((config) => ({
//       ...config,
//       errorMessage: getErrorMessage(errors, this.translate),
//       successMessage: undefined,
//     }));
//   }

//   public onAccountSelect(account: Account): void {
//     this.selectedAccountId = account.id;
//     // console.log('Selected account:', account);
//   }

//   //account store

//   public readonly accounts = toSignal(this.store.select(selectAccounts), {
//     initialValue: [],
//   });

//   public readonly isLoadingAccounts = toSignal(
//     this.store.select(selectIsLoading),
//     { initialValue: false },
//   );
//   public readonly accountsError = toSignal(this.store.select(selectError), {
//     initialValue: null,
//   });
//   // public accountsError = signal('fff');

//   public retryLoadAccounts(): void {}
//   public navigateToCreateAccount(): void {}
// }
