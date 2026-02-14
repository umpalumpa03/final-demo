import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestModal } from './request-modal';
import { TranslateModule } from '@ngx-translate/core';
import { LoansStore } from '../../../store/loans.store';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { Store } from '@ngrx/store';

describe('RequestModal', () => {
  let component: RequestModal;
  let fixture: ComponentFixture<RequestModal>;

  const mockGELAccount = {
    id: 'acc-1',
    currency: 'GEL',
    friendlyName: 'My GEL Acc',
    balance: 100,
    name: 'Account 1',
  };
  const mockUSDAccount = {
    id: 'acc-2',
    currency: 'USD',
    friendlyName: 'My USD Acc',
    balance: 50,
    name: 'Account 2',
  };
  const mockAccounts = [mockGELAccount, mockUSDAccount];

  const globalStoreMock = {
    selectSignal: vi.fn().mockReturnValue(signal(mockAccounts)),
    dispatch: vi.fn(),
  };

  const loansStoreMock = {
    loading: signal(false),
    error: signal(null),
    requestLoan: vi.fn(),
    loadPurposes: vi.fn(),
    loadMonths: vi.fn(),
    purposeOptions: signal([{ label: 'Purpose 1', value: 'p1' }]),
    loanMonthsOptions: signal([{ label: '12 Months', value: 12 }]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestModal, TranslateModule.forRoot()],
      providers: [
        { provide: Store, useValue: globalStoreMock },
        { provide: LoansStore, useValue: loansStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestModal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('isOpen', true);

    vi.spyOn(component.close, 'emit');

    fixture.detectChanges();
  });

  it('should create and load initial data on init', () => {
    expect(component).toBeTruthy();
    expect(loansStoreMock.loadMonths).toHaveBeenCalled();
    expect(loansStoreMock.loadPurposes).toHaveBeenCalled();
  });

  it('should filter accounts and map them to options correctly', () => {
    const options = component['accountOptions']();

    expect(options.length).toBe(1);
    expect(options[0].value).toBe(mockGELAccount.id);
    expect(options[0].label).toContain('My GEL Acc');
    expect(options[0].label).toContain('100 GEL');

    const usdOption = options.find((o) => o.value === mockUSDAccount.id);
    expect(usdOption).toBeUndefined();
  });

  it('should mark form as touched if invalid on save', () => {
    const markTouchedSpy = vi.spyOn(component.form, 'markAllAsTouched');

    component.onSave();

    expect(component.form.valid).toBe(false);
    expect(loansStoreMock.requestLoan).not.toHaveBeenCalled();
    expect(markTouchedSpy).toHaveBeenCalled();
    expect(component.close.emit).not.toHaveBeenCalled();
  });

  it('should submit request and close modal if form is valid', () => {
    component.form.patchValue({
      loanAmount: 500,
      amountToReceiveAccountId: 'acc-1',
      months: 12,
      purpose: 'p1',
      firstPaymentDate: '2023-01-01',
      contact: {
        address: {
          street: 'Main St',
          city: 'Tbilisi',
          region: 'Tbilisi',
          postalCode: '1234',
        },
        contactPerson: {
          name: 'John Doe',
          relationship: 'Brother',
          phone: '555123456',
          email: 'john@example.com',
        },
      },
    });

    component.onSave();

    expect(component.form.valid).toBe(true);

    expect(loansStoreMock.requestLoan).toHaveBeenCalledWith(
      expect.objectContaining({
        loanAmount: 500,
        months: 12,
        amountToReceiveAccountId: 'acc-1',
        contact: expect.objectContaining({
          address: expect.objectContaining({ city: 'Tbilisi' }),
        }),
      }),
    );

    expect(component.close.emit).toHaveBeenCalled();
  });
});
