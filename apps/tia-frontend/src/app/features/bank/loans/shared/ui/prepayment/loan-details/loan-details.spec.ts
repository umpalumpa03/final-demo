import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanDetails } from './loan-details';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';

describe('LoanDetails', () => {
  let component: LoanDetails;
  let fixture: ComponentFixture<LoanDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDetails, TranslateModule.forRoot()],
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

  it('should call checkScrollPosition on scroll', () => {
    const spy = vi.spyOn(component as any, 'checkScrollPosition');
    component['onScroll']();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle scrollToBottom when element exists', () => {
    const mockElement = {
      scrollTo: vi.fn(),
      scrollHeight: 1000,
    };
    component['scrollContainer'] = signal({
      nativeElement: mockElement,
    }) as any;

    component['scrollToBottom']();

    expect(mockElement.scrollTo).toHaveBeenCalledWith({
      top: 1000,
      behavior: 'smooth',
    });
  });

  it('should handle scrollToBottom when element does not exist', () => {
    component['scrollContainer'] = signal(undefined) as any;
    expect(() => component['scrollToBottom']()).not.toThrow();
  });

  it('should set showScrollButton based on scroll position', () => {
    const mockElement = {
      scrollHeight: 1000,
      clientHeight: 500,
      scrollTop: 0,
    };
    component['scrollContainer'] = signal({
      nativeElement: mockElement,
    }) as any;

    component['checkScrollPosition']();

    expect(component['showScrollButton']()).toBe(true);
  });

  it('should hide scroll button when at bottom', () => {
    const mockElement = {
      scrollHeight: 1000,
      clientHeight: 500,
      scrollTop: 500,
    };
    component['scrollContainer'] = signal({
      nativeElement: mockElement,
    }) as any;

    component['checkScrollPosition']();

    expect(component['showScrollButton']()).toBe(false);
  });

  it('should not calculate prepayment when loan is null', () => {
    fixture.componentRef.setInput('loan', null);
    const emitSpy = vi.spyOn(component.calculatePrepayment, 'emit');

    component['onCalculate']();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
