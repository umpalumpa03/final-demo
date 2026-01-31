import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ExternalAmount } from './external-amount';
import { TransfersApiService } from '../../../../services/transfersApi.service';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferExternalService } from '../../../../services/transfer.external.service';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('ExternalAmount (vitest)', () => {
  let component: ExternalAmount;
  let fixture: ComponentFixture<ExternalAmount>;
  let transfersApiMock: any;
  let transferStoreMock: any;
  let transferExternalServiceMock: any;

  beforeEach(async () => {
    transfersApiMock = {
      getFee: vi.fn().mockReturnValue(of({ fee: 0 })),
    };

    transferStoreMock = {
      isLoading: signal(false),
      senderAccount: signal({ id: 'a1', currency: 'GEL', balance: 1000 }),
      selectedRecipientAccount: signal({ id: 'r1', name: 'Recipient' }),
      manualRecipientName: signal(''),
      recipientInfo: signal(null),
      recipientType: signal('phone'),
      amount: signal(0),
      description: signal(''),
    };

    transferExternalServiceMock = {
      handleAmountGoBack: vi.fn(),
      handleTransfer: vi.fn(),
      getInitials: vi.fn().mockImplementation((name) => (name ? name[0] : '')),
    };

    await TestBed.configureTestingModule({
      imports: [ExternalAmount, TranslateModule.forRoot()],
      providers: [
        { provide: TransfersApiService, useValue: transfersApiMock },
        { provide: TransferStore, useValue: transferStoreMock },
      ],
    })
      .overrideComponent(ExternalAmount, {
        set: {
          providers: [
            {
              provide: TransferExternalService,
              useValue: transferExternalServiceMock,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ExternalAmount);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should handle go back action', () => {
    fixture.detectChanges();
    component.amountInput.setValue('100');
    component.descriptionInput.setValue('test');

    component.onGoBack();

    expect(transferExternalServiceMock.handleAmountGoBack).toHaveBeenCalledWith(
      100,
      'test',
      expect.anything(),
    );
  });

  it('should handle transfer action when valid', () => {
    transferExternalServiceMock.handleTransfer.mockReturnValue(true);
    fixture.detectChanges();
    component.amountInput.setValue('100');

    component.onTransfer();

    expect(transferExternalServiceMock.handleTransfer).toHaveBeenCalledWith(
      100,
      '',
    );
  });

  it('should calculate initials correctly', () => {
    fixture.detectChanges();
    expect(component.recipientInitials()).toBe('R');
  });
});
