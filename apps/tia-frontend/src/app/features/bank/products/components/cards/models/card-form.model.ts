import { FormControl } from '@angular/forms';

export interface CardForm {
  cardName: FormControl<string>;
  cardCategory: FormControl<'DEBIT' | 'CREDIT'>;
  cardType: FormControl<'VISA' | 'MASTERCARD'>;
  accountId: FormControl<string>;
  design: FormControl<string>;
}