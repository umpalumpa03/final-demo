import {
  Component,
  inject,
  OnInit,
  DestroyRef,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FinancesStore } from '../store/finances.store';
import { FinancesView } from '../components/finances-view';
import { FINANCES_FILTER_OPTIONS, getMonthOptions } from '../config/filter-options.config';
import { FilterType } from '../models/filter.model';
import { dateRangeValidator } from '../validators/date-range.validator';

@Component({
  selector: 'app-finances-container',
  imports: [FinancesView],
  templateUrl: './finances-container.html',
  styleUrl: './finances-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancesContainer implements OnInit {
  readonly store = inject(FinancesStore);
  private readonly destroyRef = inject(DestroyRef);

 

  public readonly financeTitle = 'My Finances';
  public readonly financeSubTitle = 'Track your income, expenses, and savings';

  public readonly monthOptions = signal(getMonthOptions());

  public activeFilter = signal<FilterType | null>(null);
  readonly filterOptions = FINANCES_FILTER_OPTIONS;

  public readonly filterForm = new FormGroup(
    {
      selectedMonth: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
    },
    { validators: dateRangeValidator('fromDate', 'toDate') },
  );

  ngOnInit(): void {
    this.fetchData();

    this.filterForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(
          (prev, curr) => prev === curr,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        if (this.filterForm.valid) {
          this.fetchData();
        }
      });
  }

  public onFilterChange(type: FilterType): void {
    const newType = this.activeFilter() === type ? null : type;
    this.activeFilter.set(newType);

    this.filterForm.patchValue(
      {
        selectedMonth: '',
        fromDate: '',
        toDate: '',
      },
      { emitEvent: false },
    );

    if (newType === null) {
      this.fetchData();
    }
  }

  private fetchData(): void {
    const { selectedMonth, fromDate, toDate } = this.filterForm.getRawValue();
    const currentFilter = this.activeFilter();

    let params: { from: string; to?: string } | null = null;

    if (currentFilter === 'month') {
      if (selectedMonth) {
        params = { from: selectedMonth };
      }
    } else if (currentFilter === 'custom') {
      if (fromDate && toDate) {
        params = { from: fromDate, to: toDate };
      }
    } else {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      params = {
        from: lastYear.toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
      };
    }

    if (params) {
      this.store.loadAllData(params);
    }
  }

  public getControl(name: string): FormControl {
    return this.filterForm.get(name) as FormControl;
  }
}
