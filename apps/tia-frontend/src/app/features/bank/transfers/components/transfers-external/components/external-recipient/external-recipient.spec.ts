import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ExternalRecipient } from './external-recipient';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TransferValidationService } from '../../services/transfer-validation.service';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferRecipientService } from '../../services/transfer-recipient.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { AlertService } from 'apps/tia-frontend/src/app/core/services/alert/alert.service';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { signal, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('ExternalRecipient', () => {
  let component: ExternalRecipient;
  let fixture: ComponentFixture<ExternalRecipient>;
  let mockStore: any;
  let mockValidationService: any;
  let mockRecipientService: any;
  let mockAlertService: any;

  beforeEach(async () => {
    vi.useFakeTimers();

    mockStore = {
      isLoading: signal(false),
      error: signal<string>(''),
      recipientInput: signal(''),
      setError: vi.fn((val: string) => mockStore.error.set(val)),
    };

    mockValidationService = {
      identifyRecipientType: vi.fn(),
      validatePhone: vi.fn().mockReturnValue(true),
      validateIban: vi.fn().mockReturnValue(true),
    };

    mockRecipientService = {
      verifyRecipient: vi.fn(),
    };

    mockAlertService = {
      error: vi.fn(),
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
        { provide: AlertService, useValue: mockAlertService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalRecipient);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should initialize with stored value from store', () => {
    mockStore.recipientInput.set('GE123456');
    fixture.detectChanges();
    expect(component.recipientInput.value).toBe('GE123456');
  });

  it('should handle error from store via effect', async () => {
    fixture.detectChanges();
    mockStore.error.set('transfers.errors.notFound');

    TestBed.flushEffects();

    expect(mockAlertService.error).toHaveBeenCalled();
    expect(component.recipientInput.value).toBe(null); 
    expect(mockStore.setError).toHaveBeenCalledWith('');
  });

  it('should call verifyRecipient only when form is valid', () => {
    fixture.detectChanges();

    component.recipientInput.setValue('');
    component.onVerify();
    expect(mockRecipientService.verifyRecipient).not.toHaveBeenCalled();

    component.recipientInput.setValue('555777888');
    vi.spyOn(component.recipientInput, 'valid', 'get').mockReturnValue(true);

    component.onVerify();
    expect(mockRecipientService.verifyRecipient).toHaveBeenCalledWith(
      '555777888',
    );
  });

  it('should update config with success message when type is identified', () => {
    mockValidationService.identifyRecipientType.mockReturnValue('phone');
    fixture.detectChanges();

    component.recipientInput.setValue('555999000');

    const config = component.recipientInputConfig();
    expect(config.successMessage).toBeDefined();
    expect(config.prefixIcon).toContain('phone');
  });

  it('should clear messages and reset icon when input is empty', () => {
    fixture.detectChanges();
    component.recipientInput.setValue('GE123');
    component.recipientInput.setValue(''); 

    const config = component.recipientInputConfig();
    expect(config.successMessage).toBeUndefined();
    expect(config.errorMessage).toBeUndefined();
    expect(config.prefixIcon).toContain('person.svg');
  });

  it('should update config with error message when form has validation errors', () => {
    fixture.detectChanges();
    mockValidationService.identifyRecipientType.mockReturnValue(null);

    component.recipientInput.setValue('invalid');
    component.recipientInput.setErrors({ invalidRecipient: true });

    component.recipientInput.updateValueAndValidity();

    const config = component.recipientInputConfig();
    expect(config.errorMessage).toBeDefined();
    expect(config.successMessage).toBeUndefined();
  });

  it('should detect mobile state from breakpoint service', () => {
    expect(component.isMobile()).toBe(false);
  });

  it('should reflect loading state from store', () => {
    mockStore.isLoading.set(true);
    expect(component.isLoading()).toBe(true);
  });
});
