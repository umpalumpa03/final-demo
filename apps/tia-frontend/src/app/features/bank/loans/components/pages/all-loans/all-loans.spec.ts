import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllLoans } from './all-loans';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LoansActions } from '../../../store/loans.actions';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { selectLoansWithAccountInfo } from '../../../store/loans.selectors';
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
      months: [],
      purposes: [],
    },
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllLoans],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            { selector: selectLoansWithAccountInfo, value: mockLoans },
          ],
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

  it('should dispatch loadLoans and loadAccounts on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(LoansActions.loadLoans());
    expect(store.dispatch).toHaveBeenCalledWith(AccountsActions.loadAccounts());
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

  it('should open prepayment modal and close details', () => {
    const loan = { id: '1', status: 2 } as any;
    component.onOpenPrepayment(loan);
    expect(component.isPrepaymentOpen()).toBe(true);
    expect(component.isDetailsOpen()).toBe(false);
    expect(component.selectedLoan()).toEqual(loan);
  });

  it('should reset state on closeModals', () => {
    component.isDetailsOpen.set(true);
    component.closeModals();
    expect(component.isDetailsOpen()).toBe(false);
    expect(component.selectedLoan()).toBeNull();
  });
});
