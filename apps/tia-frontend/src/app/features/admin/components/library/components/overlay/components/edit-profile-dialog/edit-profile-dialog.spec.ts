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

  it('should call toggle() when the trigger button is clicked', () => {
    const triggerBtn = fixture.debugElement.query(
      By.css('.edit-profile-trigger'),
    );

    triggerBtn.triggerEventHandler('click', null);

    expect(component.isOpen()).toBe(true);
  });
});
