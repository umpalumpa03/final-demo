import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import {
  createCard,
  closeCreateCardModal,
  loadCardCreationData,
} from 'apps/tia-frontend/src/app/store/products/cards/cards.actions';
import {
  selectCardCreationData,
  selectIsCreating,
  selectCreateError,
  selectCardCreationDataLoading,
} from 'apps/tia-frontend/src/app/store/products/cards/cards.selectors';
import { CreateCard } from '../../components/cards/components/create-card-modal/container/createCard';

describe('CreateCard Integration', () => {
  let component: CreateCard;
  let fixture: ComponentFixture<CreateCard>;
  let store: MockStore;

  const mockCreationData = {
    designs: [
      { id: 'design-1', designName: 'Blue Card', uri: '/designs/blue.jpg' },
      { id: 'design-2', designName: 'Red Card', uri: '/designs/red.jpg' },
    ],
    categories: [
      { value: 'DEBIT' as const, displayName: 'Debit' },
      { value: 'CREDIT' as const, displayName: 'Credit' },
    ],
    types: [
      { value: 'VISA' as const, displayName: 'Visa' },
      { value: 'MASTERCARD' as const, displayName: 'Mastercard' },
    ],
    accounts: [
      {
        id: 'acc-1',
        name: 'Main Account',
        balance: 1000,
        currency: 'GEL',
        iban: 'GE123',
        status: 'ACTIVE',
        cardIds: [],
        openedAt: '2024-01-01',
      },
      {
        id: 'acc-2',
        name: 'Savings',
        balance: 5000,
        currency: 'USD',
        iban: 'GE456',
        status: 'ACTIVE',
        cardIds: [],
        openedAt: '2024-01-01',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCard, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          initialState: {
            cards: {
              designs: mockCreationData.designs,
              categories: mockCreationData.categories,
              types: mockCreationData.types,
              accounts: mockCreationData.accounts,
              isCreating: false,
              createError: null,
              loading: false,
            },
          },
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    store.overrideSelector(selectCardCreationData, mockCreationData);
    store.overrideSelector(selectIsCreating, false);
    store.overrideSelector(selectCreateError, null);
    store.overrideSelector(selectCardCreationDataLoading, false);

    fixture = TestBed.createComponent(CreateCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

 it('should auto-select first design on load', async () => {
  await new Promise(resolve => setTimeout(resolve, 10));
  const viewData = await firstValueFrom(component['viewData$']);

  expect(component['selectedDesignId']).toBe('design-1');
  expect(component['cardForm'].value.design).toBe('design-1');
  expect(viewData.selectedDesignUri).toBe('/designs/blue.jpg');
});
  it('should map creation data to view options', async () => {
    const viewData = await firstValueFrom(component['viewData$']);

    expect(viewData.categoryOptions).toEqual([
      { label: 'Debit', value: 'DEBIT' },
      { label: 'Credit', value: 'CREDIT' },
    ]);
    expect(viewData.typeOptions).toEqual([
      { label: 'Visa', value: 'VISA' },
      { label: 'Mastercard', value: 'MASTERCARD' },
    ]);
    expect(viewData.accountOptions).toEqual([
      { label: 'Main Account - 1000 GEL', value: 'acc-1' },
      { label: 'Savings - 5000 USD', value: 'acc-2' },
    ]);
  });

  it('should update selected design and form', async () => {
    component['onDesignSelected']('design-2');

    expect(component['selectedDesignId']).toBe('design-2');
    expect(component['cardForm'].value.design).toBe('design-2');

    const viewData = await firstValueFrom(component['viewData$']);
    expect(viewData.selectedDesignUri).toBe('/designs/red.jpg');
  });

  it('should create card with valid form', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component['cardForm'].patchValue({
      cardName: 'My New Card',
      cardCategory: 'CREDIT',
      cardType: 'MASTERCARD',
      accountId: 'acc-2',
      design: 'design-2',
    });

    component['onFormSubmit']();

    expect(dispatchSpy).toHaveBeenCalledWith(
      createCard({
        request: {
          cardName: 'My New Card',
          cardCategory: 'CREDIT',
          cardType: 'MASTERCARD',
          accountId: 'acc-2',
          design: 'design-2',
        },
      })
    );
  });

  it('should not submit invalid form', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component['cardForm'].patchValue({
      cardName: '',
      accountId: '',
    });

    component['onFormSubmit']();

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: '[Cards] Create Card' })
    );
  });

  it('should reset form and close on cancel', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);

    component['cardForm'].patchValue({
      cardName: 'Test Card',
      accountId: 'acc-1',
    });

    component['onFormCancel']();

    expect(component['cardForm'].value.cardName).toBe('');
    expect(dispatchSpy).toHaveBeenCalledWith(closeCreateCardModal());
    expect(closedSpy).toHaveBeenCalled();
  });

  it('should reset form and close on modal close', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const closedSpy = vi.fn();
    component.closed.subscribe(closedSpy);

    component['onClose']();

    expect(component['cardForm'].pristine).toBe(true);
    expect(dispatchSpy).toHaveBeenCalledWith(closeCreateCardModal());
    expect(closedSpy).toHaveBeenCalled();
  });

  it('should show creating state', async () => {
    store.overrideSelector(selectIsCreating, true);
    store.refreshState();

    const viewData = await firstValueFrom(component['viewData$']);

    expect(viewData.isCreating).toBe(true);
  });

  it('should show error message', async () => {
    store.overrideSelector(selectCreateError, 'Failed to create card');
    store.refreshState();

    const viewData = await firstValueFrom(component['viewData$']);

    expect(viewData.createError).toBe('Failed to create card');
  });
  it('should show no accounts message when accounts list is empty', async () => {
  const emptyCreationData = {
    ...mockCreationData,
    accounts: [],
  };

  store.overrideSelector(selectCardCreationData, emptyCreationData);
  store.refreshState();

  await new Promise(resolve => setTimeout(resolve, 10));
  
  const viewData = await firstValueFrom(component['viewData$']);

  expect(viewData.accountOptions).toEqual([{
    label: 'my-products.card.create-card-modal.create-card-form.noAccounts',
    value: '',
  }]);
});
});