import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CardDetailsModal } from './card-details-modal';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  closeCardOtpModal,
  openCardOtpModal,
  updateCardName,
} from 'apps/tia-frontend/src/app/store/products/cards/cards.actions';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { selectCardDetailsModalData } from 'apps/tia-frontend/src/app/store/products/cards/cards.selectors';

describe('CardDetailsModal', () => {
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
    imageBase64: 'base64image',
    account: {
      id: 'acc-1',
      iban: 'GE123',
      name: 'Main',
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

  const initialState = {
    cards: {
      isOtpModalOpen: false,
      selectedCardIdForOtp: null,
      globalAlert: null,
      cardSensitiveData: {},
      isUpdatingCardName: false,
      cardDetails: {
        'card-1': mockModalData.details,
      },
      cardImages: {
        'card-1': 'base64image',
      },
      accounts: [mockModalData.account],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDetailsModal,TranslateModule.forRoot()],
      providers: [provideRouter([]), provideMockStore({ initialState })],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CardDetailsModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });


  it('should emit closed event', () => {
    const spy = vi.fn();
    component.closed.subscribe(spy);

    component.handleClose();

    expect(spy).toHaveBeenCalled();
  });

  it('should dispatch updateCardName action', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.handleCardNameUpdate('card-1', 'New Name');

    expect(dispatchSpy).toHaveBeenCalledWith(
      updateCardName({ cardId: 'card-1', cardName: 'New Name' }),
    );
  });
it('should dispatch openCardOtpModal action when cardId exists', () => {
  store.overrideSelector(selectCardDetailsModalData, mockModalData);
  store.refreshState();
  
  const dispatchSpy = vi.spyOn(store, 'dispatch');

  component.handleRequestOtp();

  expect(dispatchSpy).toHaveBeenCalledWith(
    openCardOtpModal({ cardId: 'card-1' }),
  );
});

  it('should dispatch closeCardOtpModal action', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.handleCloseOtpModal();

    expect(dispatchSpy).toHaveBeenCalledWith(closeCardOtpModal());
  });

 
  it('should return null when modalData cardId is missing', async () => {
    const stateWithoutCardId = {
      ...initialState,
      cards: {
        ...initialState.cards,
        cardDetails: {},
        cardImages: {},
      },
    };

    store.setState(stateWithoutCardId);

    const data = await firstValueFrom(component.cardSensitiveData$);
    expect(data).toBeNull();
  });

  it('should return null when sensitiveData for cardId does not exist', async () => {
    const data = await firstValueFrom(component.cardSensitiveData$);
    expect(data).toBeNull();
  });
});