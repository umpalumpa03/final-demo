import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestModal } from './request-modal';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LoansCreateActions } from 'apps/tia-frontend/src/app/store/loans/loans.actions';
import { TranslateModule } from '@ngx-translate/core';
import { LoansStore } from '../../../store/loans.store';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { signal } from '@angular/core';

describe('RequestModal', () => {
  let component: RequestModal;
  let fixture: ComponentFixture<RequestModal>;
  let globalStore: MockStore;
  let loansStoreMock: any;

  beforeEach(async () => {
    loansStoreMock = {
      loanMonthsOptions: signal([{ label: '12 Months', value: 12 }]),
      purposeOptions: signal([{ label: 'Personal', value: 'personal' }]),
      loadMonths: vi.fn(),
      loadPurposes: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RequestModal, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectAccounts,
              value: [
                {
                  id: '1',
                  friendlyName: 'Checking',
                  balance: 1000,
                  currency: 'GEL',
                },
                {
                  id: '2',
                  name: 'Savings',
                  balance: 5000,
                  currency: 'GEL',
                },
                {
                  id: '3',
                  name: 'USD Account',
                  balance: 500,
                  currency: 'USD',
                },
              ],
            },
          ],
        }),
        { provide: LoansStore, useValue: loansStoreMock },
      ],
    }).compileComponents();

    globalStore = TestBed.inject(MockStore);
    vi.spyOn(globalStore, 'dispatch');

    fixture = TestBed.createComponent(RequestModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create and load dependencies', () => {
    expect(component).toBeTruthy();
    expect(loansStoreMock.loadMonths).toHaveBeenCalled();
    expect(loansStoreMock.loadPurposes).toHaveBeenCalled();
  });

  it('should filter accounts by GEL currency', () => {
    const options = (component as any).accountOptions();
    expect(options).toHaveLength(2);
    expect(options[0].label).toContain('Checking');
    expect(options[1].label).toContain('Savings');
  });

  it('should not dispatch if form invalid', () => {
    component.form.reset();
    component.onSave();
    expect(globalStore.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: LoansCreateActions.requestLoan.type }),
    );
  });
});
