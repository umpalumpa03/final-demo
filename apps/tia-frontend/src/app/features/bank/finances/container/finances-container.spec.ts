import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesContainer } from './finances-container';
import { FinancesStore } from '../store/finances.store';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NO_ERRORS_SCHEMA, Component, signal, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FinancesView } from '../components/finances-view/container/finances-view';
import { TranslateModule } from '@ngx-translate/core';

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
  @Input() isRefreshing: any;
  @Output() filterChange = new EventEmitter<any>();
  @Output() update = new EventEmitter<void>();
}

describe('FinancesContainer', () => {
  let component: FinancesContainer;
  let fixture: ComponentFixture<FinancesContainer>;

  const storeMock = {
    loadAllData: vi.fn(),
    resetStore: vi.fn(),
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
    isRefreshing: signal(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FinancesContainer, 
        ReactiveFormsModule,
        MockFinancesView,
        TranslateModule.forRoot()
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

  it('should create and call loadAllData on init', () => {
    fixture.detectChanges(); 
    expect(component).toBeTruthy();
    expect(storeMock.loadAllData).toHaveBeenCalled();
  });

  it('should call resetStore when component is destroyed', () => {
    fixture.detectChanges();
    fixture.destroy();
    expect(storeMock.resetStore).toHaveBeenCalled();
  });

  it('should handle filter change to month and reset form', () => {
    fixture.detectChanges();
    component.onFilterChange('month');
    
    expect(component.activeFilter()).toBe('month');
    expect(component.filterForm.get('selectedMonth')?.value).toBe('');
  });

  it('should handle update trigger (force refresh)', () => {
    fixture.detectChanges();
    vi.clearAllMocks();
    
    component.onUpdateData();
    
    expect(storeMock.loadAllData).toHaveBeenCalledWith(expect.objectContaining({
      force: true
    }));
  });

  it('should call loadAllData with specific month when month filter is active', () => {
    fixture.detectChanges();
    component.activeFilter.set('month');
    component.filterForm.patchValue({ selectedMonth: '2024-05' });
    
    (component as any).fetchData();
    
    expect(storeMock.loadAllData).toHaveBeenCalledWith(expect.objectContaining({
      from: '2024-05'
    }));
  });

  it('should call loadAllData with date range when custom filter is active', () => {
    fixture.detectChanges();
    component.activeFilter.set('custom');
    component.filterForm.patchValue({ 
      fromDate: '2024-01-01', 
      toDate: '2024-01-10' 
    });
    
    (component as any).fetchData();
    
    expect(storeMock.loadAllData).toHaveBeenCalledWith({
      from: '2024-01-01',
      to: '2024-01-10',
      force: false
    });
  });

  it('should return form control via getControl', () => {
    const control = component.getControl('fromDate');
    expect(control).toBe(component.filterForm.get('fromDate'));
  });
});