import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfirmAccountDialog } from './confirm-account-dialog';

describe('ConfirmAccountDialog', () => {
  let component: ConfirmAccountDialog;
  let fixture: ComponentFixture<ConfirmAccountDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmAccountDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmAccountDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial isOpen state as false', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('should toggle isOpen signal when toggle() is called', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);

    component.toggle();
    expect(component.isOpen()).toBe(false);
  });

  it('should trigger toggle when the main trigger button is clicked', () => {
    const triggerBtn = fixture.debugElement.query(By.css('.btn__trigger'));

    triggerBtn.triggerEventHandler('click', null);

    expect(component.isOpen()).toBe(true);
  });

  it('should call toggle when the modal emits the closed event', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.css('app-ui-modal'));
    modal.triggerEventHandler('closed', null);

    expect(component.isOpen()).toBe(false);
  });
});
