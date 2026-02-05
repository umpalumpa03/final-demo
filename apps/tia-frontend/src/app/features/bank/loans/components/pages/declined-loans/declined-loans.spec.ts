import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeclinedLoans } from './declined-loans';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LoansStore } from '../../../store/loans.store';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('DeclinedLoans', () => {
  let component: DeclinedLoans;
  let fixture: ComponentFixture<DeclinedLoans>;
  let globalStore: MockStore;
  let loansStoreMock: any;
  let routerMock: any;

  const mockLoans = [
    { id: 'loan-1', status: 3, accountName: 'Acc 1', loanAmount: 1000 },
  ];

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
      imports: [DeclinedLoans, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
        { provide: LoansStore, useValue: loansStoreMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    globalStore = TestBed.inject(MockStore);
    vi.spyOn(globalStore, 'dispatch');

    fixture = TestBed.createComponent(DeclinedLoans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load declined loans on init', () => {
    expect(loansStoreMock.loadLoans).toHaveBeenCalledWith({ status: 3 });
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

  it('should reset state on closeModals', () => {
    component.isDetailsOpen.set(true);
    component.closeModals();
    expect(component.isDetailsOpen()).toBe(false);
    expect(component.selectedLoan()).toBeNull();
    expect(loansStoreMock.clearLoanDetails).toHaveBeenCalled();
  });
});
