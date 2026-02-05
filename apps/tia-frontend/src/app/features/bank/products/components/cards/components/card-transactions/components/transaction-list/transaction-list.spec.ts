import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionList } from './transaction-list';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';

describe('TransactionList', () => {
  let component: TransactionList;
  let fixture: ComponentFixture<TransactionList>;

 const mockTransactions: ITransactions[] = [
  {
    id: 'tx-1',
    userId: 'user-1',
    amount: 100.50,
    transactionType: 'debit',
    transferType: 'BillPayment',
    currency: 'GEL',
    description: 'Test Transaction',
    debitAccountNumber: 'GE123',
    creditAccountNumber: null,
    category: 'Utilities',
    convertionInfo: undefined,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionList],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionList);
    component = fixture.componentInstance;
  });

  it('should create and render with transactions', () => {
    fixture.componentRef.setInput('transactions', mockTransactions);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should format date correctly', () => {
    const formatted = component['formatDate']('2024-01-14T10:00:00Z');
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('14');
  });

  it('should format amount correctly', () => {
    expect(component['formatAmount']('100.50', 'GEL')).toBe('-GEL 100.50');
    expect(component['formatAmount'](100.5, 'USD')).toBe('-USD 100.50');
  });

  it('should get category name correctly', () => {
    expect(component['getCategoryName']('Shopping')).toBe('Shopping');
    expect(component['getCategoryName']({ categoryName: 'Food' })).toBe('Food');
    expect(component['getCategoryName'](null)).toBe('Uncategorized');
  });
});