import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { TopSheetModal } from './top-sheet-modal';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('TopSheetModal', () => {
  let component: TopSheetModal;
  let fixture: ComponentFixture<TopSheetModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopSheetModal, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TopSheetModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update the isOpen signal state when toggle is called', () => {
    expect(component.isOpen()).toBe(false);
    component.toggle();
    expect(component.isOpen()).toBe(true);
    component.toggle();
    expect(component.isOpen()).toBe(false);
  });

  it('should call the toggle method when the app-button trigger is clicked', () => {
    const toggleSpy = vi.spyOn(component, 'toggle');
    const triggerBtn = fixture.debugElement.query(By.css('app-button'));

    triggerBtn.triggerEventHandler('click', null);

    expect(toggleSpy).toHaveBeenCalled();
  });
});
