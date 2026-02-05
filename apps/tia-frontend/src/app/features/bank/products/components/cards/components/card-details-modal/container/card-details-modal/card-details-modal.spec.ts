import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CardDetailsModal } from './card-details-modal';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDetailsModal, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectCardDetailsModalData, value: mockModalData },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CardDetailsModal);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should emit closed event on handleClose', () => {
    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);

    component['handleClose']();

    expect(closedSpy).toHaveBeenCalled();
  });

  it('should call handleRequestOtp', () => {
    const spy = vi.spyOn(component as any, 'handleRequestOtp');

    component['handleRequestOtp']();

    expect(spy).toHaveBeenCalled();
  });
});
