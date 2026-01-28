import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  LOAN_FORM_CONFIG,
  MOCK_ACCOUNT_OPTIONS,
  PURPOSE_OPTIONS,
} from '../../config/loan-request.config';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { IDropdownOption, ILoanRequest } from '../../models/loan-request.model';
import { Store } from '@ngrx/store';
import { LoansActions } from '../../../store/loans.actions';
import { Observable } from 'rxjs';
import { selectLoanMonthsOptions } from '../../../store/loans.selectors';
import { CommonModule } from '@angular/common';
import { selectAccountOptions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';

@Component({
  selector: 'app-request-modal',
  imports: [
    UiModal,
    ButtonComponent,
    TextInput,
    Dropdowns,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './request-modal.html',
  styleUrl: './request-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestModal implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  public readonly isOpen = input.required<boolean>();
  public readonly close = output<void>();
  public readonly submit = output<ILoanRequest>();

  protected readonly cfg = LOAN_FORM_CONFIG;
  protected readonly termOptions$: Observable<IDropdownOption[]> =
    this.store.select(selectLoanMonthsOptions);
  protected readonly purposeOptions = PURPOSE_OPTIONS;
  protected readonly accountOptions$: Observable<IDropdownOption[]> =
    this.store.select(selectAccountOptions);

  public ngOnInit(): void {
    this.store.dispatch(LoansActions.loadMonths());
    this.store.dispatch(AccountsActions.loadAccounts());
  }

  public readonly form = this.fb.group({
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

  public onSave(): void {
    if (this.form.valid) {
      const formData = this.form.getRawValue() as ILoanRequest;
      this.submit.emit(formData);
      this.form.reset();
      this.close.emit();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
