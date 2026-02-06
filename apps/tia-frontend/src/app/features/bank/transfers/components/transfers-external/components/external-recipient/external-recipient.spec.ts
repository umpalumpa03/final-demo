import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ExternalRecipient } from './external-recipient';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TransferValidationService } from '../../services/transfer-validation.service';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferRecipientService } from '../../services/transfer-recipient.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { signal, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

describe('ExternalRecipient', () => {
  let component: ExternalRecipient;
  let fixture: ComponentFixture<ExternalRecipient>;
  let mockStore: any;
  let mockValidationService: any;
  let mockRecipientService: any;

  beforeEach(async () => {
    vi.useFakeTimers();

    mockStore = {
      isLoading: signal(false),
      error: signal<string>(''),
      recipientInput: signal(''),
    };

    mockValidationService = {
      identifyRecipientType: vi.fn(),
      validatePhone: vi.fn().mockReturnValue(true),
      validateIban: vi.fn().mockReturnValue(true),
    };

    mockRecipientService = {
      verifyRecipient: vi.fn(),
    };

    const mockBreakpoint = { isMobile: signal(false) };

    await TestBed.configureTestingModule({
      imports: [
        ExternalRecipient,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: TransferValidationService, useValue: mockValidationService },
        { provide: TransferStore, useValue: mockStore },
        { provide: TransferRecipientService, useValue: mockRecipientService },
        { provide: BreakpointService, useValue: mockBreakpoint },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalRecipient);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with stored value from store', () => {
    mockStore.recipientInput.set('GE123456');
    fixture.detectChanges();
    expect(component.recipientInput.value).toBe('GE123456');
  });

  it('should handle error from store and hide it after 5 seconds', async () => {
    fixture.detectChanges();
    mockStore.error.set('Something went wrong');

    fixture.detectChanges();
    await Promise.resolve();

    expect(component.showError()).toBe(true);

    vi.advanceTimersByTime(5000);
    expect(component.showError()).toBe(false);
  });

  it('should call verifyRecipient only when form is valid', () => {
    component.recipientInput.setValue('');
    component.onVerify();
    expect(mockRecipientService.verifyRecipient).not.toHaveBeenCalled();

    vi.spyOn(component.recipientInput, 'valid', 'get').mockReturnValue(true);
    component.recipientInput.setValue('555777888');
    component.onVerify();
    expect(mockRecipientService.verifyRecipient).toHaveBeenCalledWith(
      '555777888',
    );
  });

  it('should update config with success message when type is identified', () => {
    mockValidationService.identifyRecipientType.mockReturnValue('phone');
    mockValidationService.validatePhone.mockReturnValue(true);

    fixture.detectChanges();

    component.recipientInput.setValue('555999000');

    expect(component.recipientInputConfig().successMessage).toBeDefined();
    expect(component.recipientInputConfig().prefixIcon).toContain('phone');
  });

  it('should clear messages and reset icon when input is empty', () => {
    fixture.detectChanges();
    component.recipientInput.setValue('');

    const config = component.recipientInputConfig();
    expect(config.successMessage).toBeUndefined();
    expect(config.errorMessage).toBeUndefined();
    expect(config.prefixIcon).toContain('person.svg');
  });

  it('should update config with error message when form has errors', () => {
    fixture.detectChanges();
    mockValidationService.identifyRecipientType.mockReturnValue(null);

    component.recipientInput.setValue('invalid-val');
    component.recipientInput.setErrors({ invalidRecipient: true });
    expect(component.recipientInputConfig().errorMessage).toBeDefined();
    expect(component.recipientInputConfig().successMessage).toBeUndefined();
  });
});
