import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Checkboxes } from './checkboxes';

describe('Checkboxes', () => {
  let component: Checkboxes;
  let fixture: ComponentFixture<Checkboxes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkboxes],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkboxes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
