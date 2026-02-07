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
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closed event when close() is called', () => {
    const emitSpy = vi.spyOn(component.closed, 'emit');
    component.close();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit closed event when Escape key is pressed and modal is open', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.closed, 'emit');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should NOT emit closed event when Escape key is pressed and modal is closed', () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.closed, 'emit');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit navigate(-1) when onPrev is called', () => {
    const navigateSpy = vi.spyOn(component.navigate, 'emit');
    const mockEvent = { stopPropagation: vi.fn() } as any;

    component.onPrev(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(-1);
  });

  it('should emit navigate(1) when onNext is called', () => {
    const navigateSpy = vi.spyOn(component.navigate, 'emit');
    const mockEvent = { stopPropagation: vi.fn() } as any;

    component.onNext(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(1);
  });

  it('should emit navigate(-1) when left arrow key is pressed with navigation enabled', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('hasNavigation', true);
    fixture.detectChanges();

    const navigateSpy = vi.spyOn(component.navigate, 'emit');
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    document.dispatchEvent(event);

    expect(navigateSpy).toHaveBeenCalledWith(-1);
  });

  it('should NOT emit closed event when clicking inside the modal card', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.closed, 'emit');
    const card = fixture.debugElement.query(By.css('.ui-modal__card'));

    if (card) {
      card.nativeElement.click();
      expect(emitSpy).not.toHaveBeenCalled();
    }
  });
});
