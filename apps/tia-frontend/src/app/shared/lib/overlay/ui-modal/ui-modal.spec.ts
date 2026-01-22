import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { UiModal } from './ui-modal';

describe('UiModal', () => {
  let component: UiModal;
  let fixture: ComponentFixture<UiModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiModal],
    }).compileComponents();

    fixture = TestBed.createComponent(UiModal);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the modal only when isOpen is true', () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ui-modal'))).toBeNull();

    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ui-modal'))).not.toBeNull();
  });

  it('should emit closed event when the close button is clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.closed, 'emit');
    const closeBtn = fixture.debugElement.query(By.css('.ui-modal__close'));

    closeBtn.triggerEventHandler('click', null);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit closed event when Escape key is pressed', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.closed, 'emit');

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should NOT emit closed event when clicking inside the modal card', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.closed, 'emit');
    const card = fixture.debugElement.query(By.css('.ui-modal__card'));

    card.nativeElement.click();
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
