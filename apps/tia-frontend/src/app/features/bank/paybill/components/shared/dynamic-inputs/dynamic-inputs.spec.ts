import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicInputs } from './dynamic-inputs';

describe('DynamicInputs', () => {
  let component: DynamicInputs;
  let fixture: ComponentFixture<DynamicInputs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicInputs],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicInputs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
