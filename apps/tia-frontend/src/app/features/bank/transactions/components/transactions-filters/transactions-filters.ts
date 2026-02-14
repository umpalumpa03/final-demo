import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SelectOption } from '@tia/shared/lib/forms/models/input.model';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { ITransactionFilter } from '@tia/shared/models/transactions/transactions.models';
import { Currency } from '@tia/shared/models/transactions/base.models';
import { FilterConfig } from '../../models/transactions-filters.models';
import { getTransactionFiltersConfig } from '../../config/transactions-filters-data';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import {
  getActiveFilters,
  mapFormIntoTransactionFilter,
} from '../../utils/transactions-filters.utils';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TransactionsViewModelService } from '../../services/transactions-view-model.service';
import { TransactionsActionsService } from '../../services/transactions-actions.service';

@Component({
  selector: 'app-transactions-filters',
  imports: [
    ReactiveFormsModule,
    TextInput,
    Dropdowns,
    ButtonComponent,
    TranslatePipe,
    TranslateModule,
  ],
  templateUrl: './transactions-filters.html',
  styleUrl: './transactions-filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsFilters {
  private readonly fb = inject(FormBuilder);
  public readonly vm = inject(TransactionsViewModelService);
  public readonly actions = inject(TransactionsActionsService);

  public readonly filterChange = output<ITransactionFilter>();
  public readonly categoryOptions = input.required<SelectOption[]>();
  public readonly accountOptions = input<SelectOption[]>([]);
  public readonly currencyOptions = input<SelectOption[]>([]);

  public readonly filtersConfig = computed<FilterConfig[]>(() =>
    getTransactionFiltersConfig(
      this.categoryOptions(),
      this.accountOptions(),
      this.currencyOptions(),
    ),
  );

  public readonly filterForm = this.fb.group({
    searchCriteria: [''],
    category: [null as string | null],
    amountFrom: [null as number | null],
    amountTo: [null as number | null],
    accountIban: [null as string | null],
    currency: [null as Currency | null],
    dateFrom: [null as string | null],
    dateTo: [null as string | null],
  });

  private readonly formValues = toSignal(this.filterForm.valueChanges, {
    initialValue: this.filterForm.value,
  });

  public readonly activeFilters = computed(() =>
    getActiveFilters(this.formValues(), this.filtersConfig()),
  );
  public readonly hasActiveFilter = computed(
    () => this.activeFilters().length > 0,
  );

  constructor() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
        ),
        map(mapFormIntoTransactionFilter),
        tap((filters) => {
          this.filterChange.emit(filters);
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  public resetFilters(): void {
    this.filterForm.reset();
  }
  public removeFilter(controlName: string): void {
    this.filterForm.get(controlName)?.reset();
  }
}
