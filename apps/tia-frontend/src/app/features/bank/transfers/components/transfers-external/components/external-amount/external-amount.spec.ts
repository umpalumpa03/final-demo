import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExternalAmount } from './external-amount';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferExternalService } from '../../../../services/transfer.external.service';
import { TransfersApiService } from '../../../../services/transfersApi.service';
import { BreakpointService } from '@tia/shared/services/breakpoints/breakpoint.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

describe('ExternalAmount', () => {
  let component: ExternalAmount;
  let fixture: ComponentFixture<ExternalAmount>;
  let mockExternalService: any;
  let mockStore: any;

  beforeEach(async () => {
    mockStore = {
      isLoading: signal(false),
      fee: signal(0),
      totalWithFee: signal(0),
      senderAccount: signal({ id: 'a1', currency: 'GEL', balance: 1000 }),
      selectedRecipientAccount: signal({ id: 'r1', name: 'John Doe' }),
      manualRecipientName: signal(''),
      recipientInfo: signal(null),
      recipientType: signal('phone'),
      amount: signal(0),
      description: signal(''),
      hasInsufficientBalance: signal(false),
      requiresOtp: signal(false),
      transferSuccess: signal(false),

      setAmount: vi.fn(),
      setInsufficientBalance: vi.fn(),
      setLoading: vi.fn(),
      updateFeeInfo: vi.fn(),
      setDescription: vi.fn(),
      setManualRecipientName: vi.fn(),
      setSelectedRecipientAccount: vi.fn(),
      setSenderAccount: vi.fn(),
    };

    mockExternalService = {
      handleAmountGoBack: vi.fn(),
      handleTransfer: vi.fn(),
      handleAmountInput: vi.fn(),
    };

    const mockBreakpoint = { isMobile: signal(false) };

    await TestBed.configureTestingModule({
      imports: [ExternalAmount, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: TransferStore, useValue: mockStore },
        { provide: BreakpointService, useValue: mockBreakpoint },
        { provide: TransfersApiService, useValue: { getFee: vi.fn() } },
      ],
    })
      .overrideComponent(ExternalAmount, {
        set: {
          providers: [
            { provide: TransferExternalService, useValue: mockExternalService },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ExternalAmount);
    component = fixture.componentInstance;
  });

  it('should create and trigger initial toast (Hits ngOnInit & triggerToast)', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.showSuccess()).toBe(true);
    expect(component.currentToastMessage()).toBe(
      'transfers.external.amount.accountsSelected',
    );
  });

  it('should call handleAmountInput on value change (Hits subscription branch)', () => {
    fixture.detectChanges();
    component.amountInput.setValue('50');
    expect(mockExternalService.handleAmountInput).toHaveBeenCalledWith(50);
  });

  it('should show available balance from store (Hits computed balance)', () => {
    fixture.detectChanges();
    expect(component.availableBalance()).toBe(1000);
  });
});
