import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorApplication } from './color-application';

describe('ColorApplication', () => {
  let component: ColorApplication;
  let fixture: ComponentFixture<ColorApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorApplication],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorApplication);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
