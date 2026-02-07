import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingLoans } from './pending-loans';
import { provideMockStore } from '@ngrx/store/testing';
import { LoansStore } from '../../../store/loans.store';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('PendingLoans', () => {
  let component: PendingLoans;
  let fixture: ComponentFixture<PendingLoans>;
  let loansStoreMock: any;

  const mockLoans = [
    { id: 'loan-1', status: 1, accountName: 'Acc 1', loanAmount: 1000 },
  ];

  beforeEach(async () => {
    loansStoreMock = {
      filteredLoans: signal(mockLoans),
      loadLoans: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PendingLoans, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
        { provide: LoansStore, useValue: loansStoreMock },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingLoans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pending loans on init', () => {
    expect(loansStoreMock.loadLoans).toHaveBeenCalledWith({ status: 1 });
  });
});
