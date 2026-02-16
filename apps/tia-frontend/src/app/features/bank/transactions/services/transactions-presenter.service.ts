import { inject, Injectable, computed, signal, effect } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SelectOption } from '@tia/shared/lib/forms/models/input.model';
import { Currency } from '@tia/shared/models/transactions/base.models';
import { ITransactionFilter } from '@tia/shared/models/transactions/transactions.models';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { maxDateValidator } from '@tia/shared/lib/forms/input-field/date-picker/date-validator/date.validator';
import {
  getActiveFilters,
  mapFormIntoTransactionFilter,
} from '../utils/transactions-filters.utils';
import {
  getTransactionFiltersConfig,
  TODAY,
} from '../config/transactions-filters-data';

@Injectable()
export class TransactionsPresenterService {
  private readonly fb = inject(FormBuilder);

  public readonly categoryOptions = signal<SelectOption[]>([]);
  public readonly accountOptions = signal<SelectOption[]>([]);
  public readonly currencyOptions = signal<SelectOption[]>([]);
  public readonly initialFilters = signal<Partial<ITransactionFilter> | null>(
    null,
  );

  public readonly today = TODAY;

  public readonly filterForm = this.fb.group({
    searchCriteria: ['', Validators.maxLength(25)],
    category: [null as string | null],
    amountFrom: [null as number | null],
    amountTo: [null as number | null],
    accountIban: [null as string | null],
    currency: [null as Currency | null],
    dateFrom: [null as string | null, [maxDateValidator(TODAY)]],
    dateTo: [null as string | null, [maxDateValidator(TODAY)]],
  });

  private readonly formValues = signal(this.filterForm.value);

  public readonly filtersChanged = signal<ITransactionFilter | null>(null);

  public readonly filtersConfig = computed(() =>
    getTransactionFiltersConfig(
      this.categoryOptions(),
      this.accountOptions(),
      this.currencyOptions(),
    ),
  );

  public readonly activeFilters = computed(() =>
    getActiveFilters(this.formValues(), this.filtersConfig()),
  );

  public readonly hasActiveFilter = computed(
    () => this.activeFilters().length > 0,
  );

  constructor() {
    this.setupFormListeners();
    this.setupInitialFiltersEffect();
  }

  private setupFormListeners(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        filter(() => this.filterForm.valid),
        tap((val) => this.formValues.set(val)),
        map((val) => mapFormIntoTransactionFilter(val)),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
        ),
        tap((filters) => this.filtersChanged.set(filters)),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  private setupInitialFiltersEffect(): void {
    effect(() => {
      const initVals = this.initialFilters();
      if (initVals) {
        this.filterForm.patchValue(
          {
            searchCriteria: initVals.searchCriteria,
            category: initVals.category,
            amountFrom: initVals.amountFrom,
            amountTo: initVals.amountTo,
            accountIban: initVals.iban,
            currency: initVals.currency,
            dateFrom: initVals.dateFrom,
            dateTo: initVals.dateTo,
          },
          { emitEvent: false },
        );

        this.formValues.set(this.filterForm.value);
      }
    });
  }

  public resetFilters(): void {
    this.filterForm.reset();
  }

  public removeFilter(controlName: string): void {
    this.filterForm.get(controlName)?.reset();
  }
}
