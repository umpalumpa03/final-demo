import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanNavigation } from './loan-navigation';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoansStore } from '../../../store/loans.store';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

describe('LoanNavigation', () => {
  let component: LoanNavigation;
  let fixture: ComponentFixture<LoanNavigation>;
  let loansStoreMock: any;

  beforeEach(async () => {
    loansStoreMock = {
      loanCounts: signal({ all: 10, approved: 5, pending: 2, declined: 3 }),
    };

    await TestBed.configureTestingModule({
      imports: [LoanNavigation, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: LoansStore, useValue: loansStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanNavigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate tabs based on store counts', () => {
    const tabs = component.tabs();
    expect(tabs.length).toBe(4);
    expect(tabs[0].label).toContain('(10)');
    expect(tabs[1].label).toContain('(5)');
    expect(tabs[2].label).toContain('(2)');
    expect(tabs[3].label).toContain('(3)');
  });
});
