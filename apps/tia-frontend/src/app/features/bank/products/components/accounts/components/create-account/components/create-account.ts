import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccountType } from '../../../../../../../../shared/models/accounts/accounts.model';
import { UiModal } from '../../../../../../../../shared/lib/overlay/ui-modal/ui-modal';
import { TextInput } from '../../../../../../../../shared/lib/forms/input-field/text-input';
import { Dropdowns } from '../../../../../../../../shared/lib/forms/dropdowns/dropdowns';
import { SelectOption } from '../../../../../../../../shared/lib/forms/models/dropdowns.model';
import { ButtonComponent } from '../../../../../../../../shared/lib/primitives/button/button';
import { CREATE_ACCOUNT_CONFIG } from '../../../config/accounts.config';

@Component({
  selector: 'app-create-account',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiModal,
    TextInput,
    Dropdowns,
    ButtonComponent,
  ],
  templateUrl: './create-account.html',
  styleUrl: './create-account.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountComponent {
  public isOpen = input.required<boolean>();
  public accountForm = input.required<FormGroup>();
  public accountTypes = input.required<AccountType[]>();
  public currencies = input.required<string[]>();

  public closeModal = output<void>();
  public submitForm = output<void>();
  public backdropClick = output<MouseEvent>();

  protected readonly createConfig = CREATE_ACCOUNT_CONFIG;

  public accountTypeOptions = computed<SelectOption[]>(() =>
    this.accountTypes().map((type) => ({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: type,
    })),
  );

  public currencyOptions = computed<SelectOption[]>(() =>
    this.currencies().map((currency) => ({
      label: currency,
      value: currency,
    })),
  );

  public handleClose(): void {
    this.closeModal.emit();
  }

  public handleSubmit(): void {
    this.submitForm.emit();
  }

  public handleBackdropClick(event: MouseEvent): void {
    this.backdropClick.emit(event);
  }
}
