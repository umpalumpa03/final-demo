import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovedLoans } from './approved-loans';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LoansStore } from '../../../store/loans.store';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

describe('ApprovedLoans', () => {
  let component: ApprovedLoans;
  let fixture: ComponentFixture<ApprovedLoans>;
  let globalStore: MockStore;
  let loansStoreMock: any;
  let routerMock: any;

  const mockLoans = [
    { id: 'loan-1', status: 2, accountName: 'Acc 1', loanAmount: 1000 },
  ];
  const mockLoanDetails = { id: 'loan-1', status: 2, loanAmount: 1000 };

  beforeEach(async () => {
    loansStoreMock = {
      filteredLoans: signal(mockLoans),
      selectedLoanDetails: signal(null),
      detailsLoading: signal(false),
      loadLoans: vi.fn(),
      loadLoanDetails: vi.fn(),
      renameLoan: vi.fn(),
      clearLoanDetails: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ApprovedLoans, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
        { provide: LoansStore, useValue: loansStoreMock },
        { provide: Router, useValue: routerMock },
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

  it('should load approved loans on init', () => {
    expect(loansStoreMock.loadLoans).toHaveBeenCalledWith({ status: 2 });
  });

  it('should open details when valid card is clicked', () => {
    component.onCardClick('loan-1');
    expect(component.selectedLoan()).toEqual(mockLoans[0]);
    expect(component.isDetailsOpen()).toBe(true);
    expect(loansStoreMock.loadLoanDetails).toHaveBeenCalledWith('loan-1');
  });

  it('should dispatch renameLoan', () => {
    const event = { id: 'loan-1', name: 'New Name' };
    component.onRenameLoan(event);
    expect(loansStoreMock.renameLoan).toHaveBeenCalledWith(event);
  });

  it('should open prepayment modal', () => {
    component.onOpenPrepayment(mockLoanDetails as any);
    expect(component.isPrepaymentOpen()).toBe(true);
    expect(component.isDetailsOpen()).toBe(false);
    expect(component.prepaymentLoan()).toEqual(mockLoanDetails);
  });
});
