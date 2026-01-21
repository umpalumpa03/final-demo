import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormDialog } from './form-dialog';

describe('FormDialog', () => {
  let component: FormDialog;
  let fixture: ComponentFixture<FormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(FormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial isOpen state as false', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('should update isOpen signal when toggle is called', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);

    component.toggle();
    expect(component.isOpen()).toBe(false);
  });

  it('should call toggle when trigger button is clicked', () => {
    const trigger = fixture.debugElement.query(By.css('.form-dialog-trigger'));
    trigger.triggerEventHandler('click', null);
    expect(component.isOpen()).toBe(true);
  });

  it('should close when modal emits closed event', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.css('app-ui-modal'));
    modal.triggerEventHandler('closed', null);

    expect(component.isOpen()).toBe(false);
  });
});
