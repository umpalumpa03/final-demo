import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuccessModal } from './ui-success-modal';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('SuccessModal', () => {
  let component: SuccessModal;
  let fixture: ComponentFixture<SuccessModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessModal],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  it('should create and initialize with default signal values', () => {
    expect(component).toBeTruthy();
    expect(component.isOpen()).toBe(true);
    expect(component.title()).toBe('Success!');
    expect(component.description()).toBe('Your action was completed.');
    expect(component.buttonText()).toBe('Done');
  });

  it('should update signal inputs when provided', () => {
    fixture.componentRef.setInput('title', 'Payment Sent');
    fixture.componentRef.setInput('description', 'Money is on the way.');
    fixture.componentRef.setInput('buttonText', 'Great');

    fixture.detectChanges();

    expect(component.title()).toBe('Payment Sent');
    expect(component.description()).toBe('Money is on the way.');
    expect(component.buttonText()).toBe('Great');
  });

  it('should emit "done" when the done output is triggered', () => {
    const emitSpy = vi.spyOn(component.done, 'emit');

    component.done.emit();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit "closed" when the closed output is triggered', () => {
    const emitSpy = vi.spyOn(component.closed, 'emit');

    component.closed.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
