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
import { AccountType } from '../../../../../../../../shared/models/accounts/accounts.model';
import { UiModal } from '../../../../../../../../shared/lib/overlay/ui-modal/ui-modal';
import { TextInput } from '../../../../../../../../shared/lib/forms/input-field/text-input';
import { Dropdowns } from '../../../../../../../../shared/lib/forms/dropdowns/dropdowns';
import { SelectOption } from '../../../../../../../../shared/lib/forms/models/dropdowns.model';
import { ButtonComponent } from '../../../../../../../../shared/lib/primitives/button/button';
import { CreateAccountConfig } from '../../../../../../../../shared/models/accounts/accounts.model';
import { getCreateAccountConfig } from '../../../config/accounts.config';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';

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

  public closeModal = output<void>();
  public submitForm = output<void>();
  public backdropClick = output<MouseEvent>();

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
