import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionItem } from './transaction-item';

describe('TransactionItem', () => {
  let component: TransactionItem;
  let fixture: ComponentFixture<TransactionItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionItem],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionItem);
    component = fixture.componentInstance;
  });

  it('should create with all inputs', () => {
    fixture.componentRef.setInput('description', 'Grocery Store');
    fixture.componentRef.setInput('date', 'Jan 14, 2026');
    fixture.componentRef.setInput('category', 'Shopping');
    fixture.componentRef.setInput('referenceNumber', 'REF002');
    fixture.componentRef.setInput('amount', '-USD 125.50');
    fixture.componentRef.setInput('status', 'completed');
    fixture.componentRef.setInput('transactionType', 'debit');
    fixture.detectChanges();
    
    expect(component).toBeTruthy();
  });

  it('should compute icon path for debit transaction', () => {
    fixture.componentRef.setInput('description', 'Test');
    fixture.componentRef.setInput('date', 'Jan 1');
    fixture.componentRef.setInput('category', 'Test');
    fixture.componentRef.setInput('referenceNumber', 'REF001');
    fixture.componentRef.setInput('amount', '-100');
    fixture.componentRef.setInput('status', 'completed');
    fixture.componentRef.setInput('transactionType', 'debit');
    fixture.detectChanges();
    
  expect(component['iconPath']()).toBe('/images/svg/transactions/expense.svg'); 
  });

  it('should compute icon path for credit transaction', () => {
    fixture.componentRef.setInput('description', 'Test');
    fixture.componentRef.setInput('date', 'Jan 1');
    fixture.componentRef.setInput('category', 'Test');
    fixture.componentRef.setInput('referenceNumber', 'REF001');
    fixture.componentRef.setInput('amount', '+100');
    fixture.componentRef.setInput('status', 'completed');
    fixture.componentRef.setInput('transactionType', 'credit');
    fixture.detectChanges();
    
  expect(component['iconPath']()).toBe('/images/svg/transactions/income.svg'); 
  });

  it('should compute icon class for debit transaction', () => {
    fixture.componentRef.setInput('description', 'Test');
    fixture.componentRef.setInput('date', 'Jan 1');
    fixture.componentRef.setInput('category', 'Test');
    fixture.componentRef.setInput('referenceNumber', 'REF001');
    fixture.componentRef.setInput('amount', '-100');
    fixture.componentRef.setInput('status', 'completed');
    fixture.componentRef.setInput('transactionType', 'debit');
    fixture.detectChanges();
    
    expect(component['iconClass']()).toBe('transaction-item__icon--outcome');
  });

  it('should compute icon class for credit transaction', () => {
    fixture.componentRef.setInput('description', 'Test');
    fixture.componentRef.setInput('date', 'Jan 1');
    fixture.componentRef.setInput('category', 'Test');
    fixture.componentRef.setInput('referenceNumber', 'REF001');
    fixture.componentRef.setInput('amount', '+100');
    fixture.componentRef.setInput('status', 'completed');
    fixture.componentRef.setInput('transactionType', 'credit');
    fixture.detectChanges();
    
    expect(component['iconClass']()).toBe('transaction-item__icon--income');
  });
  it('should compute correct icon class for debit', () => {
  fixture.componentRef.setInput('description', 'Test');
  fixture.componentRef.setInput('date', 'Jan 1');
  fixture.componentRef.setInput('category', 'Test');
  fixture.componentRef.setInput('referenceNumber', 'REF001');
  fixture.componentRef.setInput('amount', '-100');
  fixture.componentRef.setInput('status', 'completed');
  fixture.componentRef.setInput('transactionType', 'debit');
  fixture.detectChanges();
  
  expect(component['iconClass']()).toBe('transaction-item__icon--outcome');
});

it('should compute correct icon class for credit', () => {
  fixture.componentRef.setInput('description', 'Test');
  fixture.componentRef.setInput('date', 'Jan 1');
  fixture.componentRef.setInput('category', 'Test');
  fixture.componentRef.setInput('referenceNumber', 'REF001');
  fixture.componentRef.setInput('amount', '+100');
  fixture.componentRef.setInput('status', 'completed');
  fixture.componentRef.setInput('transactionType', 'credit');
  fixture.detectChanges();
  
  expect(component['iconClass']()).toBe('transaction-item__icon--income');
});
});