import { Component, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SelectOption } from '@tia/shared/lib/forms/models/input.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { ITransactionFilter } from '@tia/shared/models/transactions/transactions.models';
import { Currency } from '@tia/shared/models/transactions/base.models';
import { ShowcaseCard } from "../../../../storybook/shared/showcase-card/showcase-card";
import { LibraryTitle } from "../../../../storybook/shared/library-title/library-title";

@Component({
  selector: 'app-transactions-filters',
  imports: [ReactiveFormsModule, TextInput, Dropdowns, ShowcaseCard, LibraryTitle],
  templateUrl: './transactions-filters.html',
  styleUrl: './transactions-filters.scss',
})
export class TransactionsFilters {
  private fb = inject(FormBuilder);

  public categoryOptions = input.required<SelectOption[]>();
  public accountOptions = input<SelectOption[]>([]);
  public filterChange = output<ITransactionFilter>();

  public currencyOptions: SelectOption[] = [
    { label: 'GEL', value: 'GEL' },
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
  ];

  public filterForm = this.fb.group({
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
        takeUntilDestroyed(),
      )
      .subscribe((values) => {
        this.filterChange.emit({
          searchCriteria: values.searchCriteria || '',
          category: values.category || undefined,
          amountFrom: values.amountFrom || undefined,
          amountTo: values.amountTo || undefined,
          iban: values.accountIban || undefined,
          currency: (values.currency as Currency) || undefined,
          dateFrom: values.dateFrom || undefined,
          dateTo: values.dateTo || undefined,
        });
      });
  }
}
