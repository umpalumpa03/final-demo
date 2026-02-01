import { Component, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SelectOption } from '@tia/shared/lib/forms/models/input.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { ITransactionFilter } from '@tia/shared/models/transactions/transactions.models';

@Component({
  selector: 'app-transactions-filters',
  imports: [ReactiveFormsModule, TextInput, Dropdowns],
  templateUrl: './transactions-filters.html',
  styleUrl: './transactions-filters.scss',
})
export class TransactionsFilters {
  private fb = inject(FormBuilder);

  public categoryOptions = input.required<SelectOption[]>();
  public filterChange = output<ITransactionFilter>();

  public filterForm = this.fb.group({
    searchCriteria: [''],
    category: [null as string | null],
    amountFrom: [null as number | null],
    amountTo: [null as number | null],
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
        });
      });
  }
}
