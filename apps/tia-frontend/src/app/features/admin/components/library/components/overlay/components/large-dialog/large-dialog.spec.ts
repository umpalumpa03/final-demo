import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LargeDialog } from './large-dialog';

describe('LargeDialog', () => {
  let component: LargeDialog;
  let fixture: ComponentFixture<LargeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LargeDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(LargeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isOpen set to false by default', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('should toggle isOpen signal when toggle() is called', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);

    component.toggle();
    expect(component.isOpen()).toBe(false);
  });

  it('should call toggle when the main trigger button is clicked', () => {
    const triggerBtn = fixture.debugElement.query(By.css('.btn--outline'));

    triggerBtn.triggerEventHandler('click', null);

    expect(component.isOpen()).toBe(true);
  });

  it('should call toggle when the modal emits the closed output', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.css('app-ui-modal'));
    modal.triggerEventHandler('closed', null);

    expect(component.isOpen()).toBe(false);
  });

  it('should call toggle when Decline or Accept buttons are clicked', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const footerButtons = fixture.debugElement.queryAll(
      By.css('.terms-content__footer .btn'),
    );

    footerButtons[0].triggerEventHandler('click', null);
    expect(component.isOpen()).toBe(false);

    component.toggle();
    footerButtons[1].triggerEventHandler('click', null);
    expect(component.isOpen()).toBe(false);
  });
});
