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

  it('should create and render with inputs', () => {
    fixture.componentRef.setInput('description', 'Grocery Store');
    fixture.componentRef.setInput('date', 'Jan 14, 2026');
    fixture.componentRef.setInput('category', 'Shopping');
    fixture.componentRef.setInput('referenceNumber', 'REF002');
    fixture.componentRef.setInput('amount', '-USD 125.50');
    fixture.componentRef.setInput('status', 'completed');
    fixture.detectChanges();
    
    expect(component).toBeTruthy();
  });
});