import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovedLoans } from './approved-loans';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LoansStore } from '../../../store/loans.store';
import { signal } from '@angular/core';

describe('ApprovedLoans', () => {
  let component: ApprovedLoans;
  let fixture: ComponentFixture<ApprovedLoans>;
  let globalStore: MockStore;
  let loansStoreMock: any;

  const mockLoans = [
    { id: 'loan-1', status: 2, accountName: 'Acc 1', loanAmount: 1000 },
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
      imports: [ApprovedLoans, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
        { provide: LoansStore, useValue: loansStoreMock },
      ],
    }).compileComponents();

    globalStore = TestBed.inject(MockStore);
    vi.spyOn(globalStore, 'dispatch');

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

  it('should open details and set selected loan when a valid card is clicked', () => {
    component.onCardClick('loan-1');
    expect(component.selectedLoan()).toEqual(mockLoans[0]);
    expect(component.isDetailsOpen()).toBe(true);
    expect(loansStoreMock.loadLoanDetails).toHaveBeenCalledWith('loan-1');
  });

  it('should NOT open details if the loan ID is not found', () => {
    component.onCardClick('loan-999');
    expect(component.selectedLoan()).toBeNull();
    expect(component.isDetailsOpen()).toBe(false);
  });

  it('should dispatch renameLoan', () => {
    const event = { id: 'loan-1', name: 'New Name' };
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
