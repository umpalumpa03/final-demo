import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import {
  AccountType,
  CreateAccountConfig,
} from '@tia/shared/models/accounts/accounts.model';
import { getCreateAccountConfig } from '../../shared/config/accounts.config';
import { SelectOption } from '@tia/shared/lib/forms/models/input.model';

@Component({
  selector: 'app-create-account',
  imports: [
    CommonModule,
    TranslatePipe,
    ReactiveFormsModule,
    UiModal,
    TextInput,
    Dropdowns,
    ButtonComponent,
    LibraryTitle,
  ],
  templateUrl: './create-account.html',
  styleUrl: './create-account.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountComponent implements OnInit {
  public isOpen = input.required<boolean>();
  public accountForm = input.required<FormGroup>();
  public accountTypes = input.required<AccountType[]>();
  public currencies = input.required<string[]>();
  public isCreating = input<boolean>(false);

  public closeModal = output<void>();
  public submitForm = output<void>();

  private readonly translate = inject(TranslateService);

  protected readonly createConfig = signal<CreateAccountConfig>(
    getCreateAccountConfig(this.translate),
  );

  public ngOnInit(): void {
    this.createConfig.set(getCreateAccountConfig(this.translate));
  }

  public accountTypeOptions = computed<SelectOption[]>(() =>
    this.accountTypes().map((type) => ({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: type,
    })),
  );

  public currencyOptions = computed<SelectOption[]>(() => {
    const currencies = this.currencies();
    return currencies
      ? currencies.map((currency) => ({
          label: currency,
          value: currency,
        }))
      : [];
  });

  public handleClose(): void {
    this.closeModal.emit();
  }

  public handleSubmit(): void {
    this.submitForm.emit();
  }
}
