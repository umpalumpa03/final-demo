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

  it('should toggle isOpen signal when toggle() is called', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);
    component.toggle();
    expect(component.isOpen()).toBe(false);
  });
});
