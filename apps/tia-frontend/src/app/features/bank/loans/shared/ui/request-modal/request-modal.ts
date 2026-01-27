import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import {
  LOAN_FORM_CONFIG,
  MOCK_ACCOUNT_OPTIONS,
  PURPOSE_OPTIONS,
  TERM_OPTIONS,
} from '../../config/loan-request.config';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';

@Component({
  selector: 'app-request-modal',
  imports: [
    UiModal,
    ButtonComponent,
    TextInput,
    Dropdowns,
    ReactiveFormsModule,
  ],
  templateUrl: './request-modal.html',
  styleUrl: './request-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestModal {
  public isOpen = input.required<boolean>();

  public readonly close = output<void>();
  public readonly submit = output<any>();

  protected readonly cfg = LOAN_FORM_CONFIG;

  protected readonly termOptions = TERM_OPTIONS;
  protected readonly purposeOptions = PURPOSE_OPTIONS;
  protected readonly accountOptions = MOCK_ACCOUNT_OPTIONS;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    amount: ['', [Validators.required, Validators.min(100)]],
    account: ['', Validators.required],
    term: ['', Validators.required],
    purpose: ['', Validators.required],
    firstPaymentDate: ['', Validators.required],
    address: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      region: ['', Validators.required],
      postalCode: ['', Validators.required],
    }),
    contact: this.fb.group({
      fullName: ['', Validators.required],
      relationship: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
    }),
  });

  public onSave() {
    if (this.form.valid) {
      this.submit.emit(this.form.value);
      this.form.reset();
      this.close.emit();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
