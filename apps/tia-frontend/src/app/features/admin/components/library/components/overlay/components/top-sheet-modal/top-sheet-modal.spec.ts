import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TopSheetModal } from './top-sheet-modal';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('TopSheetModal', () => {
  let component: TopSheetModal;
  let fixture: ComponentFixture<TopSheetModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopSheetModal],
    }).compileComponents();

    fixture = TestBed.createComponent(TopSheetModal);
    component = fixture.componentInstance;
  });

  it('should call toggle() when the trigger button is clicked', () => {
    fixture.detectChanges();
    const toggleSpy = vi.spyOn(component, 'toggle');
    const button = fixture.debugElement.query(By.css('.btn__bottom-trigger'));

    button.nativeElement.click();
    expect(toggleSpy).toHaveBeenCalled();
  });
});
