import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TransfersAccountCard } from './transfers-account-card';
import {
  Account,
  AccountType,
} from '@tia/shared/models/accounts/accounts.model';

describe('TransfersAccountCard', () => {
  let component: TransfersAccountCard;
  let fixture: ComponentFixture<TransfersAccountCard>;

  const mockAccount: Account = {
    id: 'test-id',
    userId: 'user-id',
    permission: 0,
    type: AccountType.saving,
    currency: 'USD',
    iban: 'GE29TIA7890123456789013',
    name: 'Savings Account',
    friendlyName: 'My USD Savings',
    status: 'active',
    balance: 2500,
    createdAt: '2026-01-18T01:10:50.948Z',
    openedAt: '2026-01-18T01:10:50.948Z',
    closedAt: '',
    isFavorite: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfersAccountCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TransfersAccountCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('cardData', mockAccount);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display account data', () => {
    expect(component.cardData()).toEqual(mockAccount);
  });

  it('should use default icon when no icon provided', () => {
    const compiled = fixture.nativeElement;
    const img = compiled.querySelector('.transfers-account-card__icon-img');
    expect(img.src).toContain('cardicon.svg');
  });

  it('should use custom icon when provided', () => {
    fixture.componentRef.setInput('icon', 'custom-icon.svg');
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const img = compiled.querySelector('.transfers-account-card__icon-img');
    expect(img.src).toContain('custom-icon.svg');
  });

  it('should not be selected by default', () => {
    expect(component.isSelected()).toBe(false);
  });

  it('should be selected when input is true', () => {
    fixture.componentRef.setInput('isSelected', true);
    fixture.detectChanges();
    expect(component.isSelected()).toBe(true);
  });

  it('should not be disabled by default', () => {
    expect(component.isDisabled()).toBe(false);
  });

  it('should be disabled when input is true', () => {
    fixture.componentRef.setInput('isDisabled', true);
    fixture.detectChanges();
    expect(component.isDisabled()).toBe(true);
  });

  it('should emit cardClicked when clicked and not disabled', () => {
    const spy = vi.fn();
    component.cardClicked.subscribe(spy);

    component['onCardClick']();

    expect(spy).toHaveBeenCalledWith(mockAccount);
  });

  it('should not emit cardClicked when disabled', () => {
    const spy = vi.fn();
    component.cardClicked.subscribe(spy);
    fixture.componentRef.setInput('isDisabled', true);
    fixture.detectChanges();

    component['onCardClick']();

    expect(spy).not.toHaveBeenCalled();
  });
});
