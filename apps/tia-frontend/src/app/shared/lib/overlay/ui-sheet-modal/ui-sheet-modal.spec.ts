import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiSheetModal } from './ui-sheet-modal';
import { vi, expect, describe, it, beforeEach } from 'vitest';

describe('UiSheetModal', () => {
  let component: UiSheetModal;
  let fixture: ComponentFixture<UiSheetModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiSheetModal],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSheetModal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('isOpen', false);
    fixture.componentRef.setInput('direction', 'top');
  });

  it('should NOT emit closed when Escape key is pressed and sheet is closed', () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.closed, 'emit');

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit closed when Escape key is pressed and sheet is open (Branch: True)', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    const emitSpy = vi.spyOn(component.closed, 'emit');

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(emitSpy).toHaveBeenCalled();
  });
});
