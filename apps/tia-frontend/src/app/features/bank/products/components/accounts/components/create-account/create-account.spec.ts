import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAccountComponent } from './create-account';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { provideTranslateService } from '@ngx-translate/core';
import { AccountType } from '@tia/shared/models/accounts/accounts.model';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;

  const mockAccountForm = new FormGroup({
    friendlyName: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    currency: new FormControl('', Validators.required),
  });

  const mockAccountTypes: AccountType[] = [
    AccountType.current,
    AccountType.saving,
  ];

  const mockCurrencies = ['USD', 'EUR', 'GBP'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAccountComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('accountForm', mockAccountForm);
      fixture.componentRef.setInput('accountTypes', mockAccountTypes);
      fixture.componentRef.setInput('currencies', mockCurrencies);
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create and emit events', () => {
    expect(component).toBeTruthy();
    const closeSpy = vi.spyOn(component.closeModal, 'emit');
    const submitSpy = vi.spyOn(component.submitForm, 'emit');
    const backdropSpy = vi.spyOn(component.backdropClick, 'emit');
    const mockEvent = new MouseEvent('click');

    component.handleClose();
    expect(closeSpy).toHaveBeenCalled();
    component.handleSubmit();
    expect(submitSpy).toHaveBeenCalled();
    component.handleBackdropClick(mockEvent);
    expect(backdropSpy).toHaveBeenCalledWith(mockEvent);
  });

  it('should compute and update options', () => {
    expect(component.accountTypeOptions().length).toBeGreaterThan(0);
    expect(component.accountTypeOptions()[0].value).toBe(AccountType.current);
    expect(component.currencyOptions().length).toBe(3);

    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('accountTypes', [AccountType.current]);
      fixture.componentRef.setInput('currencies', ['USD', 'EUR']);
    });
    fixture.detectChanges();
    expect(component.accountTypeOptions()).toHaveLength(1);
    expect(component.currencyOptions()).toHaveLength(2);
  });
});
