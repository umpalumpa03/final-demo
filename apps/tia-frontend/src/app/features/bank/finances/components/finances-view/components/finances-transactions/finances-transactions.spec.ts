import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesTransactions } from './finances-transactions';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

describe('FinancesTransactions', () => {
  let component: FinancesTransactions;
  let fixture: ComponentFixture<FinancesTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FinancesTransactions, 
        CommonModule, 
        TranslateModule.forRoot()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesTransactions);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render income transaction with "+" and correct classes', () => {
    fixture.componentRef.setInput('transactions', [{
      id: '1',
      type: 'income',
      amount: 100,
      date: new Date('2024-01-01'),
      title: 'Salary',
      category: 'Work',
      categoryColor: '#00FF00',
      isImageIcon: false,
      icon: '',
      statusIcon: 'check.svg'
    }]);
    fixture.detectChanges();

    const amountSpan = fixture.debugElement.query(By.css('.transaction-item__amount'));
    const statusBadge = fixture.debugElement.query(By.css('.transaction-item__status-badge'));

    expect(amountSpan.nativeElement.textContent.trim()).toContain('+$100');
    expect(amountSpan.classes['income']).toBe(true);
    expect(statusBadge.classes['is-income']).toBe(true);
  });

  it('should NOT apply income classes and should show "-" for expense type', () => {
    fixture.componentRef.setInput('transactions', [{
      id: '2',
      type: 'expense',
      amount: 50.5,
      date: new Date('2024-01-01'),
      title: 'Coffee',
      category: 'Food',
      categoryColor: '#FF0000',
      isImageIcon: false,
      icon: '',
      statusIcon: 'arrow.svg'
    }]);
    fixture.detectChanges();

    const amountSpan = fixture.debugElement.query(By.css('.transaction-item__amount'));
    const statusBadge = fixture.debugElement.query(By.css('.transaction-item__status-badge'));

    expect(amountSpan.nativeElement.textContent.trim()).toContain('-$50.5');
    expect(amountSpan.classes['income']).toBeFalsy();
    expect(statusBadge.classes['is-income']).toBeFalsy();
  });

  it('should format date correctly as dd/MM/yyyy', () => {
    fixture.componentRef.setInput('transactions', [{
      id: '3',
      type: 'expense',
      amount: 10,
      date: new Date(2024, 11, 31), 
      categoryColor: '#000',
      isImageIcon: false
    }]);
    fixture.detectChanges();

    const dateText = fixture.debugElement.query(By.css('.transaction-item__date')).nativeElement.textContent;
    expect(dateText.trim()).toBe('31/12/2024');
  });

  it('should render image icon when isImageIcon is true', () => {
    fixture.componentRef.setInput('transactions', [{
      id: '4',
      isImageIcon: true,
      icon: 'test-img.png',
      category: 'Travel'
    }]);
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('.transaction-item__category-img'));
    expect(img).toBeTruthy();
    expect(img.nativeElement.src).toContain('test-img.png');
  });

  it('should render correct number of transactions', () => {
    fixture.componentRef.setInput('transactions', [
      { id: '1', type: 'income', amount: 10, date: new Date(), categoryColor: '#000' },
      { id: '2', type: 'expense', amount: 20, date: new Date(), categoryColor: '#000' }
    ]);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.transaction-item'));
    expect(items.length).toBe(2);
  });
});