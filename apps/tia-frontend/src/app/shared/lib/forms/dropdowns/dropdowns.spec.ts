import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dropdowns } from './dropdowns';

describe('Dropdowns', () => {
  let component: Dropdowns;
  let fixture: ComponentFixture<Dropdowns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dropdowns],
    }).compileComponents();

    fixture = TestBed.createComponent(Dropdowns);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
