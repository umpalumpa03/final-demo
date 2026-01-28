import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LibraryTitle } from '../../../storybook/shared/library-title/library-title';
import { ButtonComponent } from '../../../../shared/lib/primitives/button/button';
import { TextInput } from '../../../../shared/lib/forms/input-field/text-input';
import { BasicAlerts } from '../../../../shared/lib/alerts/components/basic-alerts/basic-alerts';
import { StatisticCard } from '../../../../shared/lib/cards/statistic-card/statistic-card';
import { Spinner } from '../../../../shared/lib/feedback/spinner/spinner';
import { FilterOption, FilterType, SummaryCard } from '../models/filter.model';

@Component({
  selector: 'app-finances-view',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LibraryTitle,
    ButtonComponent,
    TextInput,
    BasicAlerts,
    StatisticCard,
    Spinner
  ],
  templateUrl: './finances-view.html',
  styleUrl: './finances-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancesView {
  public readonly financeTitle = input.required<string>();
  public readonly financeSubTitle = input.required<string>();
  public readonly activeFilter = input.required<string>();
  public readonly filterOptions = input.required<FilterOption[]>();
  public readonly filterForm = input.required<FormGroup>();
  public readonly loading = input<boolean>(false);
  public readonly error = input<string | null>(null);
  public readonly summaryCards = input<SummaryCard[]>([]);

  public readonly filterChange = output<FilterType>();
  public readonly dateInput = output<{ field: 'fromDate' | 'toDate'; event: Event }>();

  public getControl(name: string): FormControl {
    return this.filterForm().get(name) as FormControl;
  }

  public get isRangeInvalid(): boolean {
    return this.filterForm().hasError('dateRangeInvalid') && this.filterForm().touched;
  }

  public get isToDateInvalid(): boolean {
    const control = this.filterForm().get('toDate');
    return !!(control?.touched && control?.invalid);
  }

  public get isFromDateInvalid(): boolean {
    const control = this.filterForm().get('fromDate');
    return !!(control?.touched && control?.invalid);
  }
}