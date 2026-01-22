import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  it('should toggle isOpen signal when toggle() is called', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);

    component.toggle();
    expect(component.isOpen()).toBe(false);
  });
});
