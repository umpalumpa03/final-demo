import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanDetails } from './loan-details';

describe('LoanDetails', () => {
  let component: LoanDetails;
  let fixture: ComponentFixture<LoanDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDetails],
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
});
