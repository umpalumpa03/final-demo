import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransferSummaryComponent } from './transfer-summary';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';

describe('TransferSummaryComponent', () => {
  let component: TransferSummaryComponent;
  let fixture: ComponentFixture<TransferSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferSummaryComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TransferSummaryComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('senderAccount', {
      iban: 'GE001',
      balance: 100,
    });
    fixture.componentRef.setInput('recipientAccount', {
      iban: 'GE002',
      balance: 0,
    });
    fixture.componentRef.setInput('recipientInitials', 'JD');
    fixture.componentRef.setInput('fromLabel', 'From');
    fixture.componentRef.setInput('toLabel', 'To');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct recipient name when provided', () => {
    fixture.componentRef.setInput('recipientName', 'John Doe');
    fixture.detectChanges();
    expect(component.recipientName()).toBe('John Doe');
  });

  it('should render the provided initials', () => {
    fixture.componentRef.setInput('recipientInitials', 'JD');
    fixture.detectChanges();
    expect(component.recipientInitials()).toBe('JD');
  });
});
