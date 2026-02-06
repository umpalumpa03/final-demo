import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesTransactions } from './finances-transactions';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

describe('FinancesTransactions', () => {
  let component: FinancesTransactions;
  let fixture: ComponentFixture<FinancesTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancesTransactions],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesTransactions);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT apply income classes and should show "-" for expense type', () => {
    fixture.componentRef.setInput('transactions', [{
      id: '2',
      type: 'expense',
      amount: 50.5,
      date: new Date('2024-01-01'),
      title: 'Coffee',
      category: 'Food'
    }]);
    fixture.detectChanges();

    const iconBox = fixture.debugElement.query(By.css('.transaction-item__icon-box'));
    const amountSpan = fixture.debugElement.query(By.css('.transaction-item__amount'));

    expect(iconBox.classes['is-income']).toBeFalsy();
    expect(amountSpan.classes['income']).toBeFalsy();
    
    expect(amountSpan.nativeElement.textContent.trim()).toContain('-$50.5');
  });

  it('should format date correctly as dd/MM/yyyy', () => {
    fixture.componentRef.setInput('transactions', [{
      id: '3',
      type: 'expense',
      amount: 10,
      date: new Date(2024, 11, 31), 
    }]);
    fixture.detectChanges();

    const dateText = fixture.debugElement.query(By.css('.transaction-item__date')).nativeElement.textContent;
    expect(dateText.trim()).toBe('31/12/2024');
  });

  it('should render correct number of transactions', () => {
    fixture.componentRef.setInput('transactions', [
      { id: '1', type: 'income', amount: 10, date: new Date() },
      { id: '2', type: 'expense', amount: 20, date: new Date() }
    ]);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.transaction-item'));
    expect(items.length).toBe(2);
  });
});