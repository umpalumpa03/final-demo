import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAccountComponent } from './create-account';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountType } from '../../../../../../../../shared/models/accounts/accounts.model';
import { provideTranslateService } from '@ngx-translate/core';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeModal when handleClose is called', () => {
    const spy = vi.spyOn(component.closeModal, 'emit');
    component.handleClose();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit submitForm when handleSubmit is called', () => {
    const spy = vi.spyOn(component.submitForm, 'emit');
    component.handleSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit backdropClick with MouseEvent when handleBackdropClick is called', () => {
    const spy = vi.spyOn(component.backdropClick, 'emit');
    const mockEvent = new MouseEvent('click');
    component.handleBackdropClick(mockEvent);
    expect(spy).toHaveBeenCalledWith(mockEvent);
  });

  it('should update accountTypeOptions when accountTypes input changes', () => {
    const newAccountTypes: AccountType[] = [AccountType.current];
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('accountTypes', newAccountTypes);
    });
    fixture.detectChanges();
    const options = component.accountTypeOptions();
    expect(options).toHaveLength(1);
    expect(options[0].value).toBe(AccountType.current);
  });

  it('should update currencyOptions when currencies input changes', () => {
    const newCurrencies = ['USD', 'EUR'];
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('currencies', newCurrencies);
    });
    fixture.detectChanges();
    const options = component.currencyOptions();
    expect(options).toHaveLength(2);
  });
});
