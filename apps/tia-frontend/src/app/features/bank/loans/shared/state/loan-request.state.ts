import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TextInputType } from '@tia/shared/lib/forms/models/input.model';

@Injectable()
export class LoanRequestState {
  private readonly translate = inject(TranslateService);

  public amount = signal({
    label: this.translate.instant('loans.request.details.amount'),
    placeholder: this.translate.instant('loans.placeholders.amount_ex'),
    required: true,
    type: 'number' as TextInputType,
  });

  public account = signal({
    label: this.translate.instant('loans.request.details.account'),
    required: true,
    placeholder: this.translate.instant('loans.placeholders.select_account'),
    height: '3.6rem',
  });

  public term = signal({
    label: this.translate.instant('loans.request.details.term'),
    required: true,
    placeholder: this.translate.instant('loans.placeholders.select_term'),
    height: '3.6rem',
  });

  public purpose = signal({
    label: this.translate.instant('loans.request.details.purpose'),
    required: true,
    placeholder: this.translate.instant('loans.placeholders.select_purpose'),
    height: '3.6rem',
  });

  public date = signal({
    label: this.translate.instant('loans.request.details.date'),
    required: true,
    min: new Date().toISOString().split('T')[0],
    type: 'date' as TextInputType,
  });

  public street = signal({
    label: this.translate.instant('loans.request.address.street'),
    required: true,
    placeholder: this.translate.instant('loans.placeholders.street_ex'),
  });

  public city = signal({
    label: this.translate.instant('loans.request.address.city'),
    required: true,
    placeholder: this.translate.instant('loans.placeholders.city_ex'),
  });

  public region = signal({
    label: this.translate.instant('loans.request.address.region'),
    required: true,
    placeholder: this.translate.instant('loans.placeholders.region_ex'),
  });

  public postal = signal({
    label: this.translate.instant('loans.request.address.postal'),
    required: true,
    placeholder: this.translate.instant('loans.placeholders.postal_ex'),
  });

  public name = signal({
    label: this.translate.instant('loans.request.person.name'),
    required: true,
    placeholder: this.translate.instant('loans.placeholders.name_ex'),
  });

  public relationship = signal({
    label: this.translate.instant('loans.request.person.relationship'),
    required: true,
    placeholder: this.translate.instant('loans.placeholders.relation_ex'),
  });

  public phone = signal({
    label: this.translate.instant('loans.request.person.number'),
    required: true,
    placeholder: this.translate.instant('loans.placeholders.phone_ex'),
    errorMessage: this.translate.instant('loans.validation.phone_error'),
    prefixIcon: './images/svg/feature-loans/phone.svg',
  });

  public email = signal({
    label: this.translate.instant('loans.request.person.email'),
    placeholder: this.translate.instant('loans.placeholders.email_ex'),
    required: true,
    prefixIcon: './images/svg/feature-loans/mail.svg',
  });
}
