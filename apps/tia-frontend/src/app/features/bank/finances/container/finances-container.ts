import { Component, inject, OnInit, computed, DestroyRef } from '@angular/core';
import { FinancesStore } from '../store/finances.store';
import {
  FINANCES_FILTER_OPTIONS,
  CARDS_CONFIG,
} from '../config/filter-options.config';
import { FilterType, SummaryCard } from '../models/filter.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { dateRangeValidator } from '../validators/date-range.validator';
import { FinancesView } from '../components/finances-view';

@Component({
  selector: 'app-finances-container',
  imports: [FinancesView],
  templateUrl: './finances-container.html',
  styleUrl: './finances-container.scss',
})
export class FinancesContainer implements OnInit {
  readonly store = inject(FinancesStore);
  private readonly destroyRef = inject(DestroyRef);

  public readonly financeTitle = 'My Finances';
  public readonly financeSubTitle = 'Track your income, expenses, and savings';
  readonly filterOptions = FINANCES_FILTER_OPTIONS;
  activeFilter: FilterType = 'month';

  public readonly filterForm = new FormGroup(
    {
      fromDate: new FormControl('2026-01-15', [
        Validators.required,
        Validators.pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
      ]),
      toDate: new FormControl('2026-01-31', [
        Validators.required,
        Validators.pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
      ]),
    },
    { validators: dateRangeValidator('fromDate', 'toDate') },
  );

  public readonly summaryCardsData = computed<SummaryCard[]>(() => {
    const storeData = this.store.summary();
    if (!storeData) return [];

    return CARDS_CONFIG.map((config) => {
      const calculatedType = config.dynamicType
        ? storeData[config.key] >= 0
          ? 'positive'
          : 'negative'
        : config.type;
      const finalType: 'positive' | 'negative' =
        calculatedType === 'positive' || calculatedType === 'negative'
          ? calculatedType
          : 'positive';

      return {
        label: config.label,
        value: config.isPct
          ? `${storeData[config.key]}%`
          : this.formatCurrency(storeData[config.key] as number),
        change: `${storeData[config.changeKey] >= 0 ? '+' : ''}${storeData[config.changeKey]}%`,
        changeType: finalType,
        icon: `images/svg/cards/${config.icon}.svg`,
      };
    });
  });

  ngOnInit() {
    this.fetchData();
    this.filterForm.valueChanges
      .pipe(
        debounceTime(500),
        filter(() => this.filterForm.valid),
        distinctUntilChanged((prev, curr) => prev === curr),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.fetchData());
  }

  public onFilterChange(type: FilterType): void {
    this.activeFilter = type;
    this.fetchData();
  }

  private fetchData() {
    const { fromDate, toDate } = this.filterForm.getRawValue();
    this.store.loadSummary({
      from: fromDate ?? '',
      to: this.activeFilter === 'custom' ? (toDate ?? undefined) : undefined,
    });
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  }

  public handleInput(controlName: 'fromDate' | 'toDate', event: Event) {
    const target = event.target as HTMLInputElement;
    this.filterForm
      .get(controlName)
      ?.setValue(target.value, { emitEvent: true });
  }
}
