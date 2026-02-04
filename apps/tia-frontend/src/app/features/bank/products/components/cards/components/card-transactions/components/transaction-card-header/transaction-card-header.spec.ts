import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionCardHeader } from './transaction-card-header';

describe('TransactionCardHeader', () => {
  let component: TransactionCardHeader;
  let fixture: ComponentFixture<TransactionCardHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionCardHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionCardHeader);
    component = fixture.componentInstance;
  });

  it('should create and render with inputs', () => {
    fixture.componentRef.setInput('imageBase64', 'base64');
    fixture.componentRef.setInput('cardName', 'Test Card');
    fixture.componentRef.setInput('maskedNumber', '•••• 1234');
    fixture.componentRef.setInput('linkedAccountName', 'Main Account');
    fixture.componentRef.setInput('totalTransactions', 20);
    fixture.detectChanges();
    
    expect(component).toBeTruthy();
  });
});