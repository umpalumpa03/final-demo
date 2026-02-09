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
  it('should display all input values correctly', () => {
  fixture.componentRef.setInput('imageBase64', 'base64string');
  fixture.componentRef.setInput('cardName', 'Premium Card');
  fixture.componentRef.setInput('maskedNumber', '•••• 5678');
  fixture.componentRef.setInput('linkedAccountName', 'Savings Account');
  fixture.componentRef.setInput('totalTransactions', 42);
  fixture.detectChanges();
  
  expect(component.imageBase64()).toBe('base64string');
  expect(component.cardName()).toBe('Premium Card');
  expect(component.maskedNumber()).toBe('•••• 5678');
  expect(component.linkedAccountName()).toBe('Savings Account');
  expect(component.totalTransactions()).toBe(42);
});

it('should accept and expose all input signals', () => {
  fixture.componentRef.setInput('imageBase64', 'data:image');
  fixture.componentRef.setInput('cardName', 'Travel Card');
  fixture.componentRef.setInput('maskedNumber', '•••• 9999');
  fixture.componentRef.setInput('linkedAccountName', 'Main Account');
  fixture.componentRef.setInput('totalTransactions', 15);
  fixture.detectChanges();
  
  expect(component.imageBase64()).toBe('data:image');
  expect(component.cardName()).toBe('Travel Card');
  expect(component.maskedNumber()).toBe('•••• 9999');
  expect(component.linkedAccountName()).toBe('Main Account');
  expect(component.totalTransactions()).toBe(15);
});

});