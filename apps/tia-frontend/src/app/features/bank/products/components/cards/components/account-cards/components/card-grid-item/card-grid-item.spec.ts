import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CardGridItem } from './card-grid-item';

describe('CardGridItem', () => {
  let component: CardGridItem;
  let fixture: ComponentFixture<CardGridItem>;

  const mockCard = {
    cardId: 'card-1',
    details: {
      id: 'card-1',
      accountId: 'acc-1',
      type: 'DEBIT' as const,
      network: 'VISA' as const,
      design: 'blue',
      cardName: 'My Card',
      status: 'ACTIVE' as const,
      allowOnlinePayments: true,
      allowInternational: true,
      allowAtm: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    imageBase64: 'base64image',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CardGridItem],
    });

    fixture = TestBed.createComponent(CardGridItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('card', mockCard);
    fixture.componentRef.setInput('currency', 'GEL');
  });

  it('should emit cardClicked with cardId on click', () => {
    const emitSpy = vi.fn();
    component.cardClicked.subscribe(emitSpy);

    component.handleClick();

    expect(emitSpy).toHaveBeenCalledWith('card-1');
  });
});