import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { FormDialog } from './form-dialog';

describe('FormDialog', () => {
  let component: FormDialog;
  let fixture: ComponentFixture<FormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDialog, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update isOpen signal when toggle is called', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);

    component.toggle();
    expect(component.isOpen()).toBe(false);
  });
});
