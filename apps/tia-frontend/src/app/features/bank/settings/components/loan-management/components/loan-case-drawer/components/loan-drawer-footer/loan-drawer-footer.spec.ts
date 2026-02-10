import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { LoanDrawerFooter } from './loan-drawer-footer';

describe('LoanDrawerFooter', () => {
  let component: LoanDrawerFooter;
  let fixture: ComponentFixture<LoanDrawerFooter>;

  const mockLabels = {
    close: 'Close',
    decline: 'Decline',
    approve: 'Approve',
    cancel: 'Cancel',
    confirmDecline: 'Confirm Decline',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDrawerFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanDrawerFooter);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('labels', mockLabels);
    fixture.detectChanges();
  });

  it('onClose should emit close event', () => {
    const spy = vi.fn();
    component.close.subscribe(spy);
    component.onClose();
    expect(spy).toHaveBeenCalled();
  });

  it('onApprove should emit approve event', () => {
    const spy = vi.fn();
    component.approve.subscribe(spy);
    component.onApprove();
    expect(spy).toHaveBeenCalled();
  });

  it('onConfirmDecline should emit confirmDecline event', () => {
    const spy = vi.fn();
    component.confirmDecline.subscribe(spy);
    component.onConfirmDecline();
    expect(spy).toHaveBeenCalled();
  });
});
