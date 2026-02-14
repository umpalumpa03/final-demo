import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import {
  updateCardName,
  openCardOtpModal,
  closeCardOtpModal,
} from 'apps/tia-frontend/src/app/store/products/cards/cards.actions';
import {
  selectCardDetailsModalData,
  selectCardSensitiveData,
  selectIsOtpModalOpen,
  selectSelectedCardIdForOtp,
  selectIsUpdatingCardName,
} from 'apps/tia-frontend/src/app/store/products/cards/cards.selectors';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { CardDetailsModal } from '../../components/cards/components/card-details-modal/container/card-details-modal/card-details-modal';

describe('CardDetailsModal Integration', () => {
  let component: CardDetailsModal;
  let fixture: ComponentFixture<CardDetailsModal>;
  let store: MockStore;

  const mockModalData = {
    cardId: 'card-1',
    details: {
      id: 'card-1',
      accountId: 'acc-1',
      type: 'CREDIT' as const,
      network: 'VISA' as const,
      design: 'blue',
      cardName: 'My Card',
      status: 'ACTIVE' as const,
      allowOnlinePayments: true,
      allowInternational: true,
      allowAtm: true,
      creditLimit: 5000,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    imageBase64: 'base64-image',
    account: {
      id: 'acc-1',
      iban: 'GE123',
      name: 'Main Account',
      balance: 1000,
      currency: 'GEL',
      status: 'ACTIVE',
      cardIds: ['card-1'],
      openedAt: '2024-01-01',
    },
    currency: 'GEL',
    formattedBalance: 'GEL 1,000',
    shouldShowCreditLimit: true,
    formattedCreditLimit: 'GEL 5,000',
    isActiveStatus: true,
  };

  const mockSensitiveData = {
    'card-1': {
      cardNumber: '1234 5678 9012 3456',
      cvv: '123',
      expiryDate: '12/28',
      cardholderName: 'JOHN DOE',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDetailsModal, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          initialState: {
            cards: {
              cardDetails: { 'card-1': mockModalData.details },
              cardImages: { 'card-1': 'base64-image' },
              accounts: [mockModalData.account],
              cardSensitiveData: {},
              isOtpModalOpen: false,
              selectedCardIdForOtp: null,
              isUpdatingCardName: false,
            },
          },
        }),
        {
          provide: AlertService,
          useValue: {
            isVisible: vi.fn().mockReturnValue(false),
            alertType: vi.fn().mockReturnValue(null),
            alertMessage: vi.fn().mockReturnValue(''),
            success: vi.fn(),
            error: vi.fn(),
            clearAlert: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    store.overrideSelector(selectCardDetailsModalData, mockModalData);
    store.overrideSelector(selectCardSensitiveData, {});
    store.overrideSelector(selectIsOtpModalOpen, false);
    store.overrideSelector(selectSelectedCardIdForOtp, null);
    store.overrideSelector(selectIsUpdatingCardName, false);

    fixture = TestBed.createComponent(CardDetailsModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  it('should display modal data', async () => {
    const modalData = await firstValueFrom(component['modalData$']);

    expect(modalData).not.toBeNull();
    expect(modalData?.cardId).toBe('card-1');
    expect(modalData?.details.cardName).toBe('My Card');
    expect(modalData?.formattedBalance).toBe('GEL 1,000');
    expect(modalData?.shouldShowCreditLimit).toBe(true);
  });

  it('should not show sensitive data initially', async () => {
    const sensitiveData = await firstValueFrom(component['cardSensitiveData$']);

    expect(sensitiveData).toBeNull();
  });

  it('should request OTP when button clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.handleRequestOtp();

    expect(dispatchSpy).toHaveBeenCalledWith(openCardOtpModal({ cardId: 'card-1' }));
  });

  it('should show sensitive data after OTP verification', async () => {
    store.overrideSelector(selectCardSensitiveData, mockSensitiveData);
    store.refreshState();

    const sensitiveData = await firstValueFrom(component['cardSensitiveData$']);

    expect(sensitiveData).not.toBeNull();
    expect(sensitiveData?.cardNumber).toBe('1234 5678 9012 3456');
    expect(sensitiveData?.cvv).toBe('123');
    expect(sensitiveData?.expiryDate).toBe('12/28');
  });

  it('should update card name', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.handleCardNameUpdate('card-1', 'Updated Card Name');

    expect(dispatchSpy).toHaveBeenCalledWith(
      updateCardName({ cardId: 'card-1', cardName: 'Updated Card Name' })
    );
  });

  it('should close OTP modal', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.handleCloseOtpModal();

    expect(dispatchSpy).toHaveBeenCalledWith(closeCardOtpModal());
  });

  it('should emit closed event on close', () => {
    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);

    component.handleClose();

    expect(closedSpy).toHaveBeenCalled();
  });

  it('should show OTP modal when opened', async () => {
    store.overrideSelector(selectIsOtpModalOpen, true);
    store.overrideSelector(selectSelectedCardIdForOtp, 'card-1');
    store.refreshState();

    const isOtpModalOpen = await firstValueFrom(component['isOtpModalOpen$']);
    const selectedCardId = await firstValueFrom(component['selectedCardIdForOtp$']);

    expect(isOtpModalOpen).toBe(true);
    expect(selectedCardId).toBe('card-1');
  });

  it('should show updating state when updating card name', async () => {
    store.overrideSelector(selectIsUpdatingCardName, true);
    store.refreshState();

    const isUpdating = await firstValueFrom(component['isUpdating$']);

    expect(isUpdating).toBe(true);
  });
});