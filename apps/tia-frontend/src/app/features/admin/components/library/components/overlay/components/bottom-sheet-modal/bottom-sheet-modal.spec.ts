import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';
import { BottomSheetModal } from './bottom-sheet-modal';
describe('BottomSheetModal', () => {
  let component: BottomSheetModal;
  let fixture: ComponentFixture<BottomSheetModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomSheetModal],
    }).compileComponents();

    fixture = TestBed.createComponent(BottomSheetModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle state when toggle() is called', () => {
    expect(component.isOpen()).toBe(false);
    component.toggle();
    expect(component.isOpen()).toBe(true);
  });
});
