import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../../../shared/lib/primitives/button/button';
import { TextInput } from '../../../../../../../shared/lib/forms/input-field/text-input';
import { Dropdowns } from '../../../../../../../shared/lib/forms/dropdowns/dropdowns';
import { BasicAlerts } from '../../../../../../../shared/lib/alerts/components/basic-alerts/basic-alerts';
import {
  FilterOption,
  FilterType,
  SelectOption,
} from '../../../../models/filter.model';
import { TranslatePipe } from '@ngx-translate/core';
import { maxDateValidator } from '@tia/shared/lib/forms/input-field/date-picker/date-validator/date.validator';
@Component({
  selector: 'app-finances-filters',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    TextInput,
    Dropdowns,
    BasicAlerts,
    TranslatePipe,
  ],
  templateUrl: './finances-filters.html',
  styleUrl: './finances-filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancesFilters {
  public readonly activeFilter = input.required<FilterType | null>();
  public readonly filterOptions = input.required<FilterOption[]>();
  public readonly filterForm = input.required<FormGroup>();
  public readonly monthOptions = input<SelectOption[]>([]);

  public readonly filterChange = output<FilterType>();
  public readonly isRefreshing = input<boolean>(false);
  public readonly update = output<void>();

  protected readonly today = new Date().toISOString().split('T')[0];

  constructor() {
    effect(() => {
      const form = this.filterForm();
      if (form) {
        const fromDate = form.get('fromDate');
        const toDate = form.get('toDate');

        if (fromDate) {
          fromDate.addValidators(maxDateValidator(this.today));
          fromDate.updateValueAndValidity();
        }
        if (toDate) {
          toDate.addValidators(maxDateValidator(this.today));
          toDate.updateValueAndValidity();
        }
      }
    });
  }

  public getControl(name: string): FormControl {
    return this.filterForm().get(name) as FormControl;
  }
}
