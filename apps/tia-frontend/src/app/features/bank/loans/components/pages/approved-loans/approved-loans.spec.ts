import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovedLoans } from './approved-loans';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LoansStore } from '../../../store/loans.store';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

describe('ApprovedLoans', () => {
  let component: ApprovedLoans;
  let fixture: ComponentFixture<ApprovedLoans>;
  let loansStoreMock: any;

  const mockLoans = [
    { id: 'loan-1', status: 2, accountName: 'Acc 1', loanAmount: 1000 },
  ];

  beforeEach(async () => {
    loansStoreMock = {
      filteredLoans: signal(mockLoans),
      loadLoans: vi.fn(),
      openDetails: vi.fn(),
      renameLoan: vi.fn(),
      openPrepayment: vi.fn(),
      closeModals: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ApprovedLoans, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
        { provide: LoansStore, useValue: loansStoreMock },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    }).compileComponents();

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
});
