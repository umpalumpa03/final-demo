import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { signal, Signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { CreateCard } from './createCard';
import {
  loadCardCreationData,
  createCard,
  closeCreateCardModal,
} from '../../../../../../../../store/products/cards/cards.actions';
import * as CardsSelectors from '../../../../../../../../store/products/cards/cards.selectors';
import { CardDesign } from '@tia/shared/models/cards/card-design.model';
import { CardCategory } from '@tia/shared/models/cards/card-category.model';
import { CardType } from '@tia/shared/models/cards/card-type.model';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';

interface CardCreationData {
  designs: CardDesign[];
  categories: CardCategory[];
  types: CardType[];
  accounts: CardAccount[];
}

interface MockStore {
  selectSignal: Mock;
  dispatch: Mock;
}

describe('CreateCard', () => {
  let component: CreateCard;
  let fixture: ComponentFixture<CreateCard>;
  let store: MockStore;

  const mockCreationData: CardCreationData = {
    designs: [
      { id: 'design-1', designName: 'Classic', uri: 'http://api/design-1.png' },
      { id: 'design-2', designName: 'Modern', uri: 'http://api/design-2.png' },
    ],
    categories: [
      { value: 'DEBIT' as const, displayName: 'Debit Card' },
      { value: 'CREDIT' as const, displayName: 'Credit Card' },
    ],
    types: [
      { value: 'VISA' as const, displayName: 'Visa' },
      { value: 'MASTERCARD' as const, displayName: 'Mastercard' },
    ],
    accounts: [
      {
        id: 'acc-123',
        iban: 'GE00TB0000000000000000',
        name: 'My Account',
        balance: 1000,
        currency: 'GEL',
        status: 'ACTIVE',
        cardIds: [],
        openedAt: '2024-01-01',
      },
    ],
  };

  beforeEach(async () => {
    const storeMock: MockStore = {
      selectSignal: vi.fn((selector) => {
        if (selector === CardsSelectors.selectCardCreationData) {
          return signal(mockCreationData);
        }
        if (selector === CardsSelectors.selectIsCreating) {
          return signal(false);
        }
        if (selector === CardsSelectors.selectCreateError) {
          return signal(null);
        }
        return signal(null);
      }),
      dispatch: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CreateCard, ReactiveFormsModule],
      providers: [
        { provide: Store, useValue: storeMock },
        FormBuilder,
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as unknown as MockStore;

    fixture = TestBed.createComponent(CreateCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadCardCreationData when modal opens', () => {
    expect(store.dispatch).toHaveBeenCalledWith(loadCardCreationData());
  });

  it('should select design', () => {
    component['selectDesign']('design-1');
    expect(component['selectedDesign']()).toBe('design-1');
    expect(component['cardForm'].value.design).toBe('design-1');
  });

  it('should submit valid form', () => {
    component['cardForm'].patchValue({
      cardName: 'My New Card',
      cardCategory: 'DEBIT',
      cardType: 'VISA',
      accountId: 'acc-123',
      design: 'design-1',
    });

    component['onSubmit']();

    expect(store.dispatch).toHaveBeenCalledWith(
      createCard({
        request: {
          cardName: 'My New Card',
          cardCategory: 'DEBIT',
          cardType: 'VISA',
          accountId: 'acc-123',
          design: 'design-1',
        },
      })
    );
  });

  it('should not submit invalid form', () => {
    component['cardForm'].patchValue({
      cardName: '',
      cardCategory: 'DEBIT',
      cardType: 'VISA',
      accountId: '',
      design: '',
    });

    const dispatchCount = store.dispatch.mock.calls.length;
    component['onSubmit']();

    expect(store.dispatch).toHaveBeenCalledTimes(dispatchCount);
  });

  it('should reset form and close modal', () => {
    component['cardForm'].patchValue({
      cardName: 'Test',
      design: 'design-1',
    });
    component['selectedDesign'].set('design-1');

    component['onClose']();

    expect(component['cardForm'].value.cardName).toBe('');
    expect(component['cardForm'].value.design).toBe('');
    expect(component['selectedDesign']()).toBe('');
    expect(store.dispatch).toHaveBeenCalledWith(closeCreateCardModal());
  });

  describe('Computed values', () => {
    it('should compute selectedDesignUri', () => {
      component['selectDesign']('design-1');
      expect(component['selectedDesignUri']()).toBe('http://api/design-1.png');
    });

    it('should compute categoryOptions', () => {
      const options = component['categoryOptions']();
      expect(options).toEqual([
        { label: 'Debit Card', value: 'DEBIT' },
        { label: 'Credit Card', value: 'CREDIT' },
      ]);
    });

    it('should compute typeOptions', () => {
      const options = component['typeOptions']();
      expect(options).toEqual([
        { label: 'Visa', value: 'VISA' },
        { label: 'Mastercard', value: 'MASTERCARD' },
      ]);
    });

    it('should compute accountOptions', () => {
      const options = component['accountOptions']();
      expect(options).toEqual([
        { label: 'My Account - 1000 GEL', value: 'acc-123' },
      ]);
    });
  });

  it('should auto-select first design when designs are loaded', () => {
    expect(component['selectedDesign']()).toBe('design-1');
  });
});