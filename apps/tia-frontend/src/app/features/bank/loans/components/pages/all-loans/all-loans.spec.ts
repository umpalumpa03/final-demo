import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllLoans } from './all-loans';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { LoansContainer } from '../../../container/loans-container';
import { LoansStore } from '../../../store/loans.store';
import { signal } from '@angular/core';

describe('AllLoans', () => {
  let component: AllLoans;
  let fixture: ComponentFixture<AllLoans>;
  let globalStore: MockStore;
  let loansStoreMock: any;
  let loansContainerMock: any;

  const mockLoans = [
    { id: 'loan-1', status: 2, loanAmount: 5000 },
    { id: 'loan-2', status: 1, loanAmount: 2000 },
  ];
  const mockLoanDetails = { id: 'loan-1', status: 2, loanAmount: 5000 };

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

    loansContainerMock = {
      isModalOpen: { set: vi.fn() },
    };

    await TestBed.configureTestingModule({
      imports: [AllLoans, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
        { provide: LoansStore, useValue: loansStoreMock },
        { provide: LoansContainer, useValue: loansContainerMock },
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
    expect(loansStoreMock.loadLoans).toHaveBeenCalledWith({ status: null });
  });

  it('should open details when valid card is clicked', () => {
    component.onCardClick('loan-1');
    expect(component.isDetailsOpen()).toBe(true);
    expect(component.selectedLoan()?.id).toBe('loan-1');
    expect(loansStoreMock.loadLoanDetails).toHaveBeenCalledWith('loan-1');
  });

  it('should handle renameLoan', () => {
    const event = { id: '1', name: 'Updated' };
    component.onRenameLoan(event);
    expect(loansStoreMock.renameLoan).toHaveBeenCalledWith(event);
  });

  it('should open prepayment modal and close details', () => {
    component.onOpenPrepayment(mockLoanDetails as any);
    expect(component.isPrepaymentOpen()).toBe(true);
    expect(component.isDetailsOpen()).toBe(false);
    expect(component.selectedLoan()).toEqual(mockLoanDetails);
    expect(component.prepaymentLoan()).toEqual(mockLoanDetails);
  });

  it('should close all modals and reset state', () => {
    component.isDetailsOpen.set(true);
    component.isPrepaymentOpen.set(true);
    component.selectedLoan.set(mockLoans[0] as any);
    component.prepaymentLoan.set(mockLoanDetails as any);

    component.closeModals();

    expect(component.isDetailsOpen()).toBe(false);
    expect(component.isPrepaymentOpen()).toBe(false);
    expect(component.selectedLoan()).toBeNull();
    expect(component.prepaymentLoan()).toBeNull();
    expect(loansStoreMock.clearLoanDetails).toHaveBeenCalled();
  });
});
