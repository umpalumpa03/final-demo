import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EditProfileDialog } from './edit-profile-dialog';

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

  it('should have initial isOpen state as false', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('should toggle isOpen state when toggle() is called', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);

    component.toggle();
    expect(component.isOpen()).toBe(false);
  });

  it('should call toggle() when the trigger button is clicked', () => {
    const triggerBtn = fixture.debugElement.query(
      By.css('.edit-profile-trigger'),
    );

    triggerBtn.triggerEventHandler('click', null);

    expect(component.isOpen()).toBe(true);
  });

  it('should call toggle() when the Cancel button is clicked inside the modal', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const cancelBtn = fixture.debugElement.query(By.css('.btn-outline'));
    cancelBtn.triggerEventHandler('click', null);

    expect(component.isOpen()).toBe(false);
  });

  it('should call toggle() when the modal emits the closed output', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.css('app-ui-modal'));
    modal.triggerEventHandler('closed', null);

    expect(component.isOpen()).toBe(false);
  });
});
