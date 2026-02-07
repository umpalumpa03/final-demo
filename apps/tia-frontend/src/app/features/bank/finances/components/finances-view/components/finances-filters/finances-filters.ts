import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../../../shared/lib/primitives/button/button';
import { TextInput } from '../../../../../../../shared/lib/forms/input-field/text-input';
import { Dropdowns } from '../../../../../../../shared/lib/forms/dropdowns/dropdowns';
import { BasicAlerts } from '../../../../../../../shared/lib/alerts/components/basic-alerts/basic-alerts';
import { FilterOption, FilterType, SelectOption } from '../../../../models/filter.model';

@Component({
  selector: 'app-finances-filters',
  imports: [ReactiveFormsModule, ButtonComponent, TextInput, Dropdowns, BasicAlerts],
  templateUrl: './finances-filters.html',
  styleUrl: './finances-filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancesFilters {
  public readonly activeFilter = input.required<FilterType | null>();
  public readonly filterOptions = input.required<FilterOption[]>();
  public readonly filterForm = input.required<FormGroup>();
  public readonly monthOptions = input<SelectOption[]>([]);
  
  public readonly filterChange = output<FilterType>();

  public getControl(name: string): FormControl {
    return this.filterForm().get(name) as FormControl;
  }
}