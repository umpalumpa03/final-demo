import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { LoanDrawerDeclineForm } from './loan-drawer-decline-form';

describe('LoanDrawerDeclineForm', () => {
  let component: LoanDrawerDeclineForm;
  let fixture: ComponentFixture<LoanDrawerDeclineForm>;

  const mockLabels = {
    declineSection: 'Reason for Decline',
    declinePlaceholder: 'Please provide a reason for declining this loan...',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDrawerDeclineForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanDrawerDeclineForm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('labels', mockLabels);
    fixture.detectChanges();
  });

  it('should create with default input values', () => {
    expect(component).toBeTruthy();
    expect(component.showDeclineForm()).toBe(false);
    expect(component.declineReason()).toBe('');
    expect(component.labels()).toEqual(mockLabels);
  });

  it('onReasonInput should emit reasonInput event with the original event', () => {
    const reasonInputSpy = vi.fn();
    component.reasonInput.subscribe(reasonInputSpy);

    const mockEvent = { target: { value: 'New reason' } } as unknown as Event;
    component.onReasonInput(mockEvent);
    expect(reasonInputSpy).toHaveBeenCalledWith(mockEvent);
  });

  it('should render textarea when showDeclineForm is true', () => {
    fixture.componentRef.setInput('showDeclineForm', true);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('.loan-drawer__section--decline');
    expect(section).toBeTruthy();
  });
});
