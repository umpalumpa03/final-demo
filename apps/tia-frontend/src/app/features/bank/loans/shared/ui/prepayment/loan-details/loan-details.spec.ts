import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanDetails } from './loan-details';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { LoansStore } from '../../../../store/loans.store';

describe('LoanDetails', () => {
  let component: LoanDetails;
  let fixture: ComponentFixture<LoanDetails>;
  const storeMock = {
    loadPrepaymentOptions: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDetails, TranslateModule.forRoot()],
      providers: [{ provide: LoansStore, useValue: storeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanDetails);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit calculatePrepayment when onCalculate is called with loan', () => {
    const mockLoan = { id: '123' } as any;
    fixture.componentRef.setInput('loan', mockLoan);

    const emitSpy = vi.spyOn(component.calculatePrepayment, 'emit');

    component['onCalculate']();

    expect(emitSpy).toHaveBeenCalledWith(mockLoan);
  });

  it('should emit close when close output is triggered', () => {
    const emitSpy = vi.spyOn(component.close, 'emit');
    component.close.emit();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not calculate prepayment when loan is null', () => {
    fixture.componentRef.setInput('loan', null);
    const emitSpy = vi.spyOn(component.calculatePrepayment, 'emit');

    component['onCalculate']();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
