import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of, firstValueFrom, Observable } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateCard } from './createCard';
import { createCard, closeCreateCardModal } from 'apps/tia-frontend/src/app/store/products/cards/cards.actions';
import { TranslateModule } from '@ngx-translate/core';
import { selectIsCreating } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';

describe('CreateCard', () => {
  let component: CreateCard;
  let fixture: ComponentFixture<CreateCard>;
  let store: { select: ReturnType<typeof vi.fn>; dispatch: ReturnType<typeof vi.fn> };

  const mockCreationData = {
    designs: [{ id: 'design-1', designName: 'Blue', uri: 'uri1' }],
    categories: [{ value: 'DEBIT' as const, displayName: 'Debit' }],
    types: [{ value: 'VISA' as const, displayName: 'Visa' }],
    accounts: [{ id: 'acc-1', name: 'Main', balance: 1000, currency: 'GEL', iban: 'GE123', status: 'ACTIVE', cardIds: [], openedAt: '2024-01-01' }],
  };

  interface ViewData {
    designs: typeof mockCreationData.designs;
    selectedDesignUri: string | null;
    categoryOptions: { label: string; value: string }[];
    typeOptions: { label: string; value: string }[];
    accountOptions: { label: string; value: string }[];
    isCreating: boolean;
    createError: string | null;
    isLoading: boolean;
  }

  function setup() {
    let callIndex = 0;
    store.select = vi.fn(() => {
      const responses = [of(mockCreationData), of(false), of(null), of(false)];
      return responses[callIndex++];
    });

    fixture = TestBed.createComponent(CreateCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  }

  beforeEach(() => {
    store = { select: vi.fn(), dispatch: vi.fn() };

    TestBed.configureTestingModule({
      imports: [CreateCard, TranslateModule.forRoot()],
      providers: [
        { provide: Store, useValue: store },
        FormBuilder,
      ],
    });
  });

  it('should update design and form on onDesignSelected', () => {
    setup();
    component['onDesignSelected']('design-2');
    expect(component['selectedDesignId']).toBe('design-2');
    expect(component['cardForm'].value.design).toBe('design-2');
  });

it('should dispatch createCard on valid form', () => {
  setup();
  
  store.select = vi.fn((selector) => {
    if (selector === selectIsCreating) return of(false);
    return of(mockCreationData);
  });
  
  component['cardForm'].patchValue({
    cardName: 'My Card', 
    cardCategory: 'DEBIT', 
    cardType: 'VISA', 
    accountId: 'acc-1', 
    design: 'design-1',
  });
  
  component['onFormSubmit']();
  
  expect(store.dispatch).toHaveBeenCalledWith(createCard({
    request: { cardName: 'My Card', cardCategory: 'DEBIT', cardType: 'VISA', accountId: 'acc-1', design: 'design-1' },
  }));
});
it('should not dispatch createCard on invalid form', () => {
  setup();
  component['cardForm'].patchValue({ cardName: '', accountId: '', design: '' });
  component['cardForm'].markAsTouched();
  store.dispatch = vi.fn();
  component['onFormSubmit']();
  expect(store.dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: '[Cards] Create Card' }));
});

  it('should reset form and dispatch close on cancel', () => {
    setup();
    const emitSpy = vi.fn();
    component.closed.subscribe(emitSpy);
    component['cardForm'].patchValue({ cardName: 'Test', design: 'design-1' });
    component['onFormCancel']();
    expect(store.dispatch).toHaveBeenCalledWith(closeCreateCardModal());
    expect(emitSpy).toHaveBeenCalled();
    expect(component['cardForm'].value.cardName).toBe('');
  });

  it('should reset form and dispatch close on close', () => {
    setup();
    const emitSpy = vi.fn();
    component.closed.subscribe(emitSpy);
    component['onClose']();
    expect(store.dispatch).toHaveBeenCalledWith(closeCreateCardModal());
    expect(emitSpy).toHaveBeenCalled();
  });

  // it('should auto-select first design and map viewData$', async () => {
  //    setup();
  // await new Promise(resolve => setTimeout(resolve, 10)); // Add delay for setTimeout
  // const view = await firstValueFrom(
  //   (component as unknown as { viewData$: Observable<ViewData> }).viewData$
  // );
  // expect(component['selectedDesignId']).toBe('design-1');;
  //   expect(view.selectedDesignUri).toBe('uri1');
  //   expect(view.categoryOptions).toEqual([{ label: 'Debit', value: 'DEBIT' }]);
  //   expect(view.typeOptions).toEqual([{ label: 'Visa', value: 'VISA' }]);
  //   expect(view.accountOptions).toEqual([{ label: 'Main - 1000 GEL', value: 'acc-1' }]);
  // });
  it('should show no accounts message when accounts list is empty', async () => {
  const emptyCreationData = {
    designs: [{ id: 'design-1', designName: 'Blue', uri: 'uri1' }],
    categories: [{ value: 'DEBIT' as const, displayName: 'Debit' }],
    types: [{ value: 'VISA' as const, displayName: 'Visa' }],
    accounts: [],
  };
  
  let callIndex = 0;
  store.select = vi.fn(() => {
    const responses = [of(emptyCreationData), of(false), of(null), of(false)];
    return responses[callIndex++];
  });

  fixture = TestBed.createComponent(CreateCard);
  component = fixture.componentInstance;
  fixture.componentRef.setInput('isOpen', true);
  fixture.detectChanges();
  
  await new Promise(resolve => setTimeout(resolve, 10));
  
  const view = await firstValueFrom(
    (component as unknown as { viewData$: Observable<ViewData> }).viewData$
  );
  
  expect(view.accountOptions).toEqual([{
    label: 'my-products.card.create-card-modal.create-card-form.noAccounts',
    value: '',
  }]);
});
});

