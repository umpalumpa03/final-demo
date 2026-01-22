import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RightSheetDemo } from './right-sheet-demo';

describe('RightSheetDemo', () => {
  let component: RightSheetDemo;
  let fixture: ComponentFixture<RightSheetDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightSheetDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(RightSheetDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isOpen signal as false initially', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('should toggle isOpen signal when toggle() is called', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);
    component.toggle();
    expect(component.isOpen()).toBe(false);
  });

  it('should trigger toggle when the trigger button is clicked', () => {
    const trigger = fixture.debugElement.query(By.css('.btn__trigger'));
    trigger.triggerEventHandler('click', null);
    expect(component.isOpen()).toBe(true);
  });
});
