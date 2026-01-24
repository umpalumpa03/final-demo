import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultistepForms } from './multistep-forms';

describe('MultistepForms', () => {
  let component: MultistepForms;
  let fixture: ComponentFixture<MultistepForms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultistepForms],
    }).compileComponents();

    fixture = TestBed.createComponent(MultistepForms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
