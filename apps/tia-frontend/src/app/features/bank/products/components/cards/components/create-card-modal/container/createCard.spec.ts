import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateCard } from './createCard';
import { createCard, closeCreateCardModal } from 'apps/tia-frontend/src/app/store/products/cards/cards.actions';

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

  beforeEach(() => {
    store = {
      select: vi.fn(() => of(mockCreationData)),
      dispatch: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [CreateCard],
      providers: [
        { provide: Store, useValue: store },
        FormBuilder,
      ],
    });

    fixture = TestBed.createComponent(CreateCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
  });

  it('should update design selection', () => {
    component['onDesignSelected']('design-2');
    
    expect(component['selectedDesignId']).toBe('design-2');
    expect(component['cardForm'].value.design).toBe('design-2');
  });

  it('should dispatch createCard on valid form submit', () => {
    component['cardForm'].patchValue({
      cardName: 'My Card',
      cardCategory: 'DEBIT',
      cardType: 'VISA',
      accountId: 'acc-1',
      design: 'design-1',
    });

    component['onFormSubmit']();

    expect(store.dispatch).toHaveBeenCalledWith(
      createCard({
        request: expect.objectContaining({
          cardName: 'My Card',
          cardCategory: 'DEBIT',
        }),
      })
    );
  });

  it('should reset form and close modal on cancel', () => {
    const emitSpy = vi.fn();
    component.closed.subscribe(emitSpy);

    component['onFormCancel']();

    expect(store.dispatch).toHaveBeenCalledWith(closeCreateCardModal());
    expect(emitSpy).toHaveBeenCalled();
    expect(component['cardForm'].value.cardName).toBe('');
  });

  it('should reset form and close modal on close', () => {
    const emitSpy = vi.fn();
    component.closed.subscribe(emitSpy);

    component['onClose']();

    expect(store.dispatch).toHaveBeenCalledWith(closeCreateCardModal());
    expect(emitSpy).toHaveBeenCalled();
  });
});