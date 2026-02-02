import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AccountHeader } from './account-header';

describe('AccountHeader', () => {
  let component: AccountHeader;
  let fixture: ComponentFixture<AccountHeader>;

  const mockAccount = {
    id: 'acc-1',
    iban: 'GE29NB0000000101904917',
    name: 'Main Account',
    balance: 1000,
    currency: 'GEL',
    status: 'ACTIVE',
    cardIds: ['card-1'],
    openedAt: '2024-01-01',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountHeader],
    });

    fixture = TestBed.createComponent(AccountHeader);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('account', mockAccount);
    fixture.componentRef.setInput('cardsLabel', '1 Card');
  });

  it('should display account information', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.account-header__name').textContent).toContain('Main Account');
    expect(compiled.querySelector('.account-header__number').textContent).toContain('GE29NB0000000101904917');
  });
});