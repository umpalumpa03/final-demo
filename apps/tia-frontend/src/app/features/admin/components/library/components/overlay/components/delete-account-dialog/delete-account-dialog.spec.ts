import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DeleteAccountDialog } from './delete-account-dialog';

describe('DeleteAccountDialog', () => {
  let component: DeleteAccountDialog;
  let fixture: ComponentFixture<DeleteAccountDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAccountDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteAccountDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
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
    const triggerBtn = fixture.debugElement.query(By.css('.btn__danger'));

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
