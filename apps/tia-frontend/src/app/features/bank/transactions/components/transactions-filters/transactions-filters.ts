import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SelectOption } from '@tia/shared/lib/forms/models/input.model';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { ITransactionFilter } from '@tia/shared/models/transactions/transactions.models';
import { Currency } from '@tia/shared/models/transactions/base.models';
import { ShowcaseCard } from '../../../../storybook/shared/showcase-card/showcase-card';
import { LibraryTitle } from '../../../../storybook/shared/library-title/library-title';
import { FilterConfig } from '../../models/transactions-filters.models';
import { getTransactionFiltersConfig } from '../../config/transactions-filters-data';

@Component({
  selector: 'app-transactions-filters',
  imports: [
    ReactiveFormsModule,
    TextInput,
    Dropdowns,
    ShowcaseCard,
    LibraryTitle,
  ],
  templateUrl: './transactions-filters.html',
  styleUrl: './transactions-filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsFilters {
  private readonly fb = inject(FormBuilder);

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

  constructor() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
        ),
        map((values) => ({
          searchCriteria: values.searchCriteria || '',
          category: values.category || undefined,
          amountFrom: values.amountFrom || undefined,
          amountTo: values.amountTo || undefined,
          iban: values.accountIban || undefined,
          currency: (values.currency as Currency) || undefined,
          dateFrom: values.dateFrom || undefined,
          dateTo: values.dateTo || undefined,
        })),
        tap((filters) => {
          this.filterChange.emit(filters);
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}
