import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  LOAN_FORM_CONFIG,
  NUMBER_REGEX,
} from '../../config/loan-request.config';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { IDropdownOption, ILoanRequest } from '../../models/loan-request.model';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { getTodayDate } from '../../utils/gettoday.util';
import { LoansCreateActions } from 'apps/tia-frontend/src/app/store/loans/loans.actions';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, map } from 'rxjs';
import { translateConfig } from '../../utils/config-translator.util';
import { LoansStore } from '../../../store/loans.store';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestModal implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly globalStore = inject(Store);
  private readonly store = inject(LoansStore);
  private readonly translate = inject(TranslateService);

  public readonly isOpen = input.required<boolean>();
  public readonly close = output<void>();
  public readonly submit = output<ILoanRequest>();

  protected readonly cfg = toSignal(
    this.translate.onLangChange.pipe(
      startWith({ lang: this.translate.getCurrentLang(), translations: null }),
      map(() =>
        translateConfig(LOAN_FORM_CONFIG, (key) => this.translate.instant(key)),
      ),
    ),
    {
      initialValue: translateConfig(LOAN_FORM_CONFIG, (key) =>
        this.translate.instant(key),
      ),
    },
  );

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

  protected readonly dateConfig = computed(() => ({
    ...this.cfg()?.date,
    min: getTodayDate(),
  }));

  public ngOnInit(): void {
    this.store.loadMonths();
    this.store.loadPurposes();

    this.globalStore.dispatch(AccountsActions.loadAccounts());
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
      } as ILoanRequest;

      this.globalStore.dispatch(
        LoansCreateActions.requestLoan({ request: payload }),
      );

      this.close.emit();
    }
  }
}
