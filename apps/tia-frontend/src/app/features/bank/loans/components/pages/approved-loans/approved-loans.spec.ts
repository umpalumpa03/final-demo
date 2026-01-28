import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovedLoans } from './approved-loans';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LoansActions } from '../../../store/loans.actions';
import { selectFilteredLoans } from '../../../store/loans.selectors';

describe('ApprovedLoans', () => {
  let component: ApprovedLoans;
  let fixture: ComponentFixture<ApprovedLoans>;
  let store: MockStore;

  const mockLoans = [
    { id: 'loan-1', status: 2, loanAmount: 1000 },
    { id: 'loan-2', status: 2, loanAmount: 2000 },
  ];

  const initialState = {
    loans_local: {
      loans: mockLoans,
      loading: false,
      error: null,
      months: [],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedLoans],
      providers: [
        provideMockStore({
          initialState,
          selectors: [{ selector: selectFilteredLoans(2), value: mockLoans }],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    vi.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ApprovedLoans);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open details when card is clicked', () => {
    component.onCardClick('loan-1');

    expect(component.selectedLoan()).toEqual(mockLoans[0]);
    expect(component.isDetailsOpen()).toBe(true);
  });

  it('should dispatch renameLoan', () => {
    const event = { id: 'loan-1', name: 'New Name' };
    component.onRenameLoan(event);
    expect(store.dispatch).toHaveBeenCalledWith(LoansActions.renameLoan(event));
  });
});
