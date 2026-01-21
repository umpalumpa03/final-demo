import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiModal } from './ui-modal';
import { By } from '@angular/platform-browser';
import { expect, describe, it, beforeEach, vi } from 'vitest';

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

  it('should not render the modal when isOpen is false', async () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.ui-modal-overlay'));
    expect(overlay).toBeNull();
  });

  it('should render the modal when isOpen is true', async () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.ui-modal-overlay'));
    expect(overlay).not.toBeNull();

    const card = fixture.debugElement.query(By.css('.ui-modal-card'));
    expect(card.attributes['role']).toBe('dialog');
  });

  it('should emit closed event when close() is called', () => {
    const emitSpy = vi.spyOn(component.closed, 'emit');

    component.close();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit closed event when overlay backdrop is clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.closed, 'emit');
    const overlay = fixture.debugElement.query(By.css('.ui-modal-overlay'));

    overlay.nativeElement.click();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit closed event when modal card is clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.closed, 'emit');
    const card = fixture.debugElement.query(By.css('.ui-modal-card'));

    card.nativeElement.click();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit closed event when Escape key is pressed', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.closed, 'emit');

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit closed event when close button is clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.closed, 'emit');
    const closeBtn = fixture.debugElement.query(By.css('.ui-modal-close-btn'));

    closeBtn.nativeElement.click();

    expect(emitSpy).toHaveBeenCalled();
  });
});
