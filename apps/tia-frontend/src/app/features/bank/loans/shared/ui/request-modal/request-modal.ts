import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';

import { NUMBER_REGEX } from '../../config/loan-request.config';
import { IDropdownOption, ILoanRequest } from '../../models/loan-request.model';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';

import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';

import { LoansStore } from '../../../store/loans.store';
import { LoanRequestState } from '../../state/loan-request.state';

@Component({
  selector: 'app-request-modal',
  imports: [
    UiModal,
    ButtonComponent,
    TextInput,
    Dropdowns,
    ReactiveFormsModule,
    CommonModule,
    TranslatePipe,
  ],
  templateUrl: './request-modal.html',
  styleUrl: './request-modal.scss',
  providers: [LoanRequestState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestModal implements OnInit {
  public readonly loanState = inject(LoanRequestState);
  private readonly fb = inject(FormBuilder);

  private readonly globalStore = inject(Store);
  protected readonly store = inject(LoansStore);

  public readonly isOpen = input.required<boolean>();
  public readonly close = output<void>();
  public readonly submit = output<ILoanRequest>();

  protected readonly isLoading = this.store.loading;
  protected readonly termOptions = this.store.loanMonthsOptions;
  protected readonly purposeOptions = this.store.purposeOptions;

  private readonly accounts = this.globalStore.selectSignal(selectAccounts);

  protected readonly accountOptions = computed<IDropdownOption[]>(() => {
    return (this.accounts() || [])
      .filter((acc) => acc.currency === 'GEL')
      .map((acc) => ({
        label: `${acc.friendlyName || acc.name} - ${acc.balance} ${acc.currency}`,
        value: acc.id,
      }));
  });

  public ngOnInit(): void {
    this.store.loadMonths({});
    this.store.loadPurposes({});
  }

  public readonly form = this.fb.group({
    loanAmount: [
      null as number | null,
      [Validators.required, Validators.min(100)],
    ],
    amountToReceiveAccountId: ['', Validators.required],
    months: [null as number | null, Validators.required],
    purpose: ['', Validators.required],
    firstPaymentDate: ['', Validators.required],
    contact: this.fb.group({
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        region: ['', Validators.required],
        postalCode: [
          '',
          [Validators.required, Validators.pattern(NUMBER_REGEX)],
        ],
      }),
      contactPerson: this.fb.group({
        name: ['', Validators.required],
        relationship: ['', Validators.required],
        phone: [
          '',
          [
            Validators.required,
            Validators.pattern(NUMBER_REGEX),
            Validators.minLength(9),
            Validators.maxLength(9),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
      }),
    }),
  });

  public onSave(): void {
    if (this.form.valid) {
      const rawData = this.form.getRawValue();

      const payload: ILoanRequest = {
        ...rawData,
        loanAmount: Number(rawData.loanAmount),
        months: Number(rawData.months),
        contact: rawData.contact,
      } as ILoanRequest;

      this.store.requestLoan(payload);

      this.close.emit();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
