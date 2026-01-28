import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllLoans } from './all-loans';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LoansActions } from '../../../store/loans.actions';
import { selectAllLoans } from '../../../store/loans.selectors';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('AllLoans', () => {
  let component: AllLoans;
  let fixture: ComponentFixture<AllLoans>;
  let store: MockStore;

  const mockLoans = [
    { id: 'loan-approved', status: 2, loanAmount: 5000 },
    { id: 'loan-pending', status: 1, loanAmount: 2000 },
  ];

  const initialState = {
    loans_local: {
      loans: mockLoans,
      loading: false,
      error: null,
      filterStatus: null,
      months: [],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllLoans],
      providers: [
        provideMockStore({
          initialState,
          selectors: [{ selector: selectAllLoans, value: mockLoans }],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    vi.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(AllLoans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open details only for approved loans (status 2)', () => {
    component.onCardClick('loan-approved');
    expect(component.isDetailsOpen()).toBe(true);
    expect(component.selectedLoan()?.id).toBe('loan-approved');
  });

  it('should not open details for non-approved loans', () => {
    component.onCardClick('loan-pending');
    expect(component.isDetailsOpen()).toBe(false);
    expect(component.selectedLoan()).toBeNull();
  });

  it('should handle renameLoan dispatch', () => {
    const event = { id: '1', name: 'Updated' };
    component.onRenameLoan(event);
    expect(store.dispatch).toHaveBeenCalledWith(LoansActions.renameLoan(event));
  });
});
