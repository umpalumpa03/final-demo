import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EditProfileDialog } from './edit-profile-dialog';
import { describe, beforeEach, it, expect } from 'vitest';

describe('EditProfileDialog', () => {
  let component: EditProfileDialog;
  let fixture: ComponentFixture<EditProfileDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProfileDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfileDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should toggle the isOpen signal state when toggle() is called', () => {
    expect(component.isOpen()).toBe(false);
    component.toggle();
    expect(component.isOpen()).toBe(true);
    component.toggle();
    expect(component.isOpen()).toBe(false);
  });

  it('should invoke toggle() when the trigger button is clicked', () => {
    const triggerBtn = fixture.debugElement.query(By.css('app-button'));
    triggerBtn.triggerEventHandler('click', null);
    expect(component.isOpen()).toBe(true);
  });
});
