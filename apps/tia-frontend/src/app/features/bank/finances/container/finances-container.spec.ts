import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesContainer } from './finances-container';
import { FinancesStore } from '../store/finances.store';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { NO_ERRORS_SCHEMA, Component, signal, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FinancesView } from '../components/finances-view/container/finances-view';

@Component({
  selector: 'app-finances-view',
  template: '',
  standalone: true
})
class MockFinancesView {
  @Input() financeTitle: any;
  @Input() financeSubTitle: any;
  @Input() activeFilter: any;
  @Input() filterOptions: any;
  @Input() filterForm: any;
  @Input() monthOptions: any;
  @Input() loading: any;
  @Input() error: any;
  @Input() summaryCards: any;
  @Input() charts: any;
  @Input() categories: any;
  @Input() transactions: any;
  @Input() incomeVsExpensesFooter: any;
  @Input() topCategoriesFooter: any;
  @Input() savingsFooter: any;
  @Input() dailySpendingFooter: any;
  @Output() filterChange = new EventEmitter<any>();
}

describe('FinancesContainer', () => {
  let component: FinancesContainer;
  let fixture: ComponentFixture<FinancesContainer>;

  const storeMock = {
    loadAllData: vi.fn(),
    loading: signal(false),
    error: signal(null),
    summaryCards: signal([]),
    charts: signal([]),
    categoriesWithIcons: signal([]),
    transactionsWithIcons: signal([]),
    incomeVsExpensesFooter: signal(null),
    topCategoriesFooter: signal([]),
    savingsFooter: signal(null),
    dailySpendingFooter: signal(null),
  };

  beforeEach(async () => {
    vi.useFakeTimers();
    
    await TestBed.configureTestingModule({
      imports: [
        FinancesContainer, 
        ReactiveFormsModule,
        MockFinancesView
      ],
      providers: [
        { provide: FinancesStore, useValue: storeMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(FinancesContainer, {
      remove: { imports: [FinancesView] },
      add: { imports: [MockFinancesView] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancesContainer);
    component = fixture.componentInstance;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create and call loadAllData on init', () => {
    fixture.detectChanges(); 
    expect(component).toBeTruthy();
    expect(storeMock.loadAllData).toHaveBeenCalled();
  });

  it('should handle filter toggle and reset form', () => {
    fixture.detectChanges();
    component.onFilterChange('month');
    expect(component.activeFilter()).toBe('month');
    
    component.onFilterChange('month'); 
    expect(component.activeFilter()).toBeNull();
  });

  it('should trigger fetchData after 500ms on valid form change', async () => {
    fixture.detectChanges();
    vi.clearAllMocks();

    component.activeFilter.set('custom');
    component.filterForm.patchValue({
      fromDate: '2024-01-01',
      toDate: '2024-01-31'
    });

    vi.advanceTimersByTime(500);
    expect(storeMock.loadAllData).toHaveBeenCalled();
  });
});