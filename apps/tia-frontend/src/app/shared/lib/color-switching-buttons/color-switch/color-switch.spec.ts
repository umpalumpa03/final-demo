import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorSwitch } from './color-switch';

describe('ColorSwitch', () => {
  let component: ColorSwitch;
  let fixture: ComponentFixture<ColorSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorSwitch],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorSwitch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
