import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { EditProfileDialog } from './edit-profile-dialog';
import { describe, beforeEach, it, expect } from 'vitest';

describe('EditProfileDialog', () => {
  let component: EditProfileDialog;
  let fixture: ComponentFixture<EditProfileDialog>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProfileDialog, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfileDialog);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
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

  it('should update signals when language changes', () => {
    component.ngOnInit();
    translate.setTranslation('ka', {});
    translate.use('ka');
    fixture.detectChanges();

    expect(component.profileTitle()).toBeDefined();
    expect(component.profileSubtitle()).toBeDefined();
    expect(component.nameInput()).toBeDefined();
    expect(component.emailInput()).toBeDefined();
  });
});
