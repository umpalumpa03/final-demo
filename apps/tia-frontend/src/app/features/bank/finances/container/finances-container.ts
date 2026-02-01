import { 
  Component, 
  inject, 
  OnInit, 
  DestroyRef, 
  ChangeDetectionStrategy 
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FinancesStore } from '../store/finances.store';
import { FinancesView } from '../components/finances-view';
import { FINANCES_FILTER_OPTIONS } from '../config/filter-options.models';
import { FilterType } from '../models/filter.model';
import { dateRangeValidator } from '../validators/date-range.validator';

@Component({
  selector: 'app-finances-container',
  imports: [FinancesView],
  templateUrl: './finances-container.html',
  styleUrl: './finances-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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

  ngOnInit(): void {
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

 
  private fetchData(): void {
    const { fromDate, toDate } = this.filterForm.getRawValue();
    this.store.loadAllData({
      from: fromDate ?? '',
      to: this.activeFilter === 'custom' ? (toDate ?? undefined) : undefined,
    });
  }

 
  public handleInput(controlName: 'fromDate' | 'toDate', event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filterForm
      .get(controlName)
      ?.setValue(target.value, { emitEvent: true });
  }
}