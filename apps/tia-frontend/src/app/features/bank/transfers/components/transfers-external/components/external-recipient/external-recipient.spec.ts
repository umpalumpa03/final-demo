import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ExternalRecipient } from './external-recipient';
import { TranslateModule } from '@ngx-translate/core';
import { TransferValidationService } from '../../../../services/transfer-validation.service';
import { TransferStore } from '../../../../store/transfers.store';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ExternalRecipient (vitest)', () => {
  let component: ExternalRecipient;
  let fixture: ComponentFixture<ExternalRecipient>;

  const mockStore = {
    isLoading: signal(false),
    error: signal<any>(null),
    recipientInput: signal(''),
    recipientInfo: signal<any>(null),
    lookupRecipient: vi.fn(),
  };

  const mockValidationService = {
    identifyRecipientType: vi.fn(),
    validatePhone: vi.fn().mockReturnValue(true),
    validateIban: vi.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalRecipient, TranslateModule.forRoot()],
      providers: [
        { provide: TransferValidationService, useValue: mockValidationService },
        { provide: TransferStore, useValue: mockStore },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalRecipient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should clear configuration when input is empty', () => {
    component.recipientInput.setValue('');
    expect(component.recipientInputConfig().successMessage).toBeUndefined();
  });

  it('should call store lookup on verify', () => {
    mockValidationService.identifyRecipientType.mockReturnValue('phone');
    vi.spyOn(component.recipientInput, 'valid', 'get').mockReturnValue(true);

    component.recipientInput.setValue('555123');
    component.onVerify();

    expect(mockStore.lookupRecipient).toHaveBeenCalled();
  });

  it('should reflect loading state from store', () => {
    mockStore.isLoading.set(true);
    fixture.detectChanges();
    expect(component.isLoading()).toBe(true);
  });
});
