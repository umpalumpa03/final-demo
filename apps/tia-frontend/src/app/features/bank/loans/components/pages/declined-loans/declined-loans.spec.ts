import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeclinedLoans } from './declined-loans';
import { provideMockStore } from '@ngrx/store/testing';
import { LoansStore } from '../../../store/loans.store';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('DeclinedLoans', () => {
  let component: DeclinedLoans;
  let fixture: ComponentFixture<DeclinedLoans>;
  let loansStoreMock: any;

  const mockLoans = [
    { id: 'loan-1', status: 3, accountName: 'Acc 1', loanAmount: 1000 },
  ];

  beforeEach(async () => {
    loansStoreMock = {
      filteredLoans: signal(mockLoans),
      loadLoans: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DeclinedLoans, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
        { provide: LoansStore, useValue: loansStoreMock },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    }).compileComponents();

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
});
