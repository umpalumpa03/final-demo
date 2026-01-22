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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render in the correct direction', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('direction', 'bottom');
    fixture.detectChanges();

    const sheet = fixture.debugElement.query(By.css('.ui-sheet--bottom'));
    expect(sheet).not.toBeNull();
  });

  it('should emit closed when backdrop is clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.closed, 'emit');
    const overlay = fixture.debugElement.query(By.css('.ui-sheet-overlay'));

    overlay.nativeElement.click();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit closed when close button is clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.closed, 'emit');
    const closeBtn = fixture.debugElement.query(By.css('.ui-sheet__close'));

    closeBtn.triggerEventHandler('click', null);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit closed when content is clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.closed, 'emit');
    const sheet = fixture.debugElement.query(By.css('.ui-sheet'));

    sheet.nativeElement.click();
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
