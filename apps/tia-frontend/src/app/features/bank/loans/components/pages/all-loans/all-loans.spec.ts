import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllLoans } from './all-loans';
import { provideMockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { LoansContainer } from '../../../container/loans-container';
import { LoansStore } from '../../../store/loans.store';
import { signal } from '@angular/core';

describe('AllLoans', () => {
  let component: AllLoans;
  let fixture: ComponentFixture<AllLoans>;
  let loansStoreMock: any;
  let loansContainerMock: any;

  const mockLoans = [{ id: 'loan-1', status: 2, loanAmount: 5000 }];

  beforeEach(async () => {
    loansStoreMock = {
      loansWithAccountInfo: signal(mockLoans),
      filteredLoans: signal(mockLoans),
      loadLoans: vi.fn(),
      // Must be signals for template access store.error()
      error: signal(null),
      loading: signal(false),

      // Mock methods used in template
      openDetails: vi.fn(),
      renameLoan: vi.fn(),
      isDetailsOpen: signal(false),
      isPrepaymentOpen: signal(false),
      selectedLoanDetails: signal(null),
      activePrepaymentLoan: signal(null),
      detailsLoading: signal(false),
      closeModals: vi.fn(),
      navigateDetails: vi.fn(),
      openPrepayment: vi.fn(),
    };

    loansContainerMock = {
      isModalOpen: signal(false),
    };
    (loansContainerMock.isModalOpen as any).set = vi.fn();

    await TestBed.configureTestingModule({
      imports: [AllLoans, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
        { provide: LoansStore, useValue: loansStoreMock },
        { provide: LoansContainer, useValue: loansContainerMock },
      ],
    }).compileComponents();

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
    expect(loansStoreMock.loadLoans).toHaveBeenCalledWith({
      status: null,
      forceChange: true,
    });
  });
});
