import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllLoans } from './all-loans';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { LoansStore } from '../../../store/loans.store';
import { signal } from '@angular/core';

describe('AllLoans', () => {
  let component: AllLoans;
  let fixture: ComponentFixture<AllLoans>;
  let globalStore: MockStore;
  let loansStoreMock: any;

  const mockLoans = [
    { id: 'loan-1', status: 2, loanAmount: 5000 },
    { id: 'loan-2', status: 1, loanAmount: 2000 },
  ];

  beforeEach(async () => {
    loansStoreMock = {
      loansWithAccountInfo: signal(mockLoans),
      selectedLoanDetails: signal(null),
      detailsLoading: signal(false),
      loadLoans: vi.fn(),
      loadLoanDetails: vi.fn(),
      renameLoan: vi.fn(),
      clearLoanDetails: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AllLoans, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
        { provide: LoansStore, useValue: loansStoreMock },
      ],
    }).compileComponents();

    globalStore = TestBed.inject(MockStore);
    vi.spyOn(globalStore, 'dispatch');

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

  it('should call loadLoans on init', () => {
    expect(loansStoreMock.loadLoans).toHaveBeenCalled();
  });

  it('should open details only for approved loans (status 2)', () => {
    component.onCardClick('loan-1');
    expect(component.isDetailsOpen()).toBe(true);
    expect(component.selectedLoan()?.id).toBe('loan-1');
    expect(loansStoreMock.loadLoanDetails).toHaveBeenCalledWith('loan-1');
  });

  it('should not open details for non-approved loans', () => {
    component.onCardClick('loan-2');
    expect(component.isDetailsOpen()).toBe(false);
    expect(component.selectedLoan()).toBeNull();
    expect(loansStoreMock.loadLoanDetails).not.toHaveBeenCalled();
  });

  it('should handle renameLoan', () => {
    const event = { id: '1', name: 'Updated' };
    component.onRenameLoan(event);
    expect(loansStoreMock.renameLoan).toHaveBeenCalledWith(event);
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
    expect(loansStoreMock.clearLoanDetails).toHaveBeenCalled();
  });
});
