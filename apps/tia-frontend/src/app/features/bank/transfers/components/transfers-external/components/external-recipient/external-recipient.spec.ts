import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ExternalRecipient } from './external-recipient';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TransferValidationService } from '../../../../services/transfer-validation.service';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferExternalService } from '../../../../services/transfer.external.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('ExternalRecipient', () => {
  let component: ExternalRecipient;
  let fixture: ComponentFixture<ExternalRecipient>;

  const mockStore = {
    isLoading: signal(false),
    error: signal<string | null>(null),
    recipientInput: signal(''),
    recipientInfo: signal<any>(null),
    recipientType: signal<string | null>(null),
    lookupRecipient: vi.fn(), 
    setExternalRecipient: vi.fn(),
  };

  const mockValidationService = {
    identifyRecipientType: vi.fn(),
    validatePhone: vi.fn().mockReturnValue(true),
    validateIban: vi.fn().mockReturnValue(true),
  };

  const mockExternalService = {
    verifyRecipient: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalRecipient, TranslateModule.forRoot()],
      providers: [
        { provide: TransferValidationService, useValue: mockValidationService },
        { provide: TransferStore, useValue: mockStore },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ExternalRecipient, {
        set: {
          providers: [
            { provide: TransferExternalService, useValue: mockExternalService },
          ],
        },
      })
      .compileComponents();

    const translate = TestBed.inject(TranslateService);
    vi.spyOn(translate, 'get').mockReturnValue(of(''));
    vi.spyOn(translate, 'instant').mockReturnValue('');

    fixture = TestBed.createComponent(ExternalRecipient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call verifyRecipient on valid submit', () => {
    component.recipientInput.setValue('555123456');
    component.recipientInput.setErrors(null);

    component.onVerify();
    expect(mockExternalService.verifyRecipient).toHaveBeenCalled();
  });
  it('should update config with success message for valid phone', () => {
    mockValidationService.identifyRecipientType.mockReturnValue('phone');
    component.recipientInput.setValue('555123456');
    fixture.detectChanges();
    
    expect(component.recipientInputConfig().successMessage).toBeDefined();
    expect(component.recipientInputConfig().errorMessage).toBeUndefined();
  });

  it('should update config with error message for invalid input', () => {
    mockValidationService.identifyRecipientType.mockReturnValue(null);
    component.recipientInput.setErrors({ invalidRecipient: true });
    component.recipientInput.setValue('abc');
    fixture.detectChanges();

    expect(component.recipientInputConfig().errorMessage).toBeDefined();
  });

});
